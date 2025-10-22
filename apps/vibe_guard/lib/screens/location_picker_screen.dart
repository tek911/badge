import 'dart:async';

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import 'package:vibe_guard/services/location_service.dart';

class LatLngLocation {
  const LatLngLocation({
    required this.latitude,
    required this.longitude,
    this.address,
  });

  final double latitude;
  final double longitude;
  final String? address;
}

class LocationPickerScreen extends StatefulWidget {
  const LocationPickerScreen({
    super.key,
    this.initialLatitude,
    this.initialLongitude,
    this.initialAddress,
  });

  final double? initialLatitude;
  final double? initialLongitude;
  final String? initialAddress;

  @override
  State<LocationPickerScreen> createState() => _LocationPickerScreenState();
}

class _LocationPickerScreenState extends State<LocationPickerScreen> {
  final LocationService _service = const LocationService();
  final Completer<GoogleMapController> _mapController =
      Completer<GoogleMapController>();

  LatLng? _selectedLatLng;
  String? _address;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.initialLatitude != null && widget.initialLongitude != null) {
      _selectedLatLng = LatLng(widget.initialLatitude!, widget.initialLongitude!);
      _address = widget.initialAddress;
    }
  }

  @override
  Widget build(BuildContext context) {
    final LatLng initialTarget = _selectedLatLng ??
        const LatLng(37.422, -122.084); // default to GooglePlex

    return Scaffold(
      appBar: AppBar(
        title: const Text('Choose location'),
        actions: <Widget>[
          TextButton(
            onPressed: _selectedLatLng == null
                ? null
                : () {
                    Navigator.of(context).pop(
                      LatLngLocation(
                        latitude: _selectedLatLng!.latitude,
                        longitude: _selectedLatLng!.longitude,
                        address: _address,
                      ),
                    );
                  },
            child: const Text('Save'),
          ),
        ],
      ),
      body: Stack(
        children: <Widget>[
          GoogleMap(
            myLocationEnabled: true,
            myLocationButtonEnabled: false,
            initialCameraPosition: CameraPosition(
              target: initialTarget,
              zoom: _selectedLatLng == null ? 12 : 16,
            ),
            onMapCreated: (GoogleMapController controller) {
              _mapController.complete(controller);
            },
            markers: _selectedLatLng == null
                ? <Marker>{}
                : <Marker>{
                    Marker(
                      markerId: const MarkerId('selected'),
                      position: _selectedLatLng!,
                      infoWindow: InfoWindow(title: _address ?? 'Selected location'),
                    ),
                  },
            onTap: (LatLng latLng) async {
              await _setSelection(latLng);
            },
          ),
          Positioned(
            bottom: 24,
            right: 16,
            left: 16,
            child: Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      _address ?? 'Tap on the map or use current location',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 12),
                    FilledButton.icon(
                      onPressed: _isLoading ? null : _useCurrentLocation,
                      icon: const Icon(Icons.my_location),
                      label: const Text('Use current location'),
                    ),
                    if (_isLoading)
                      const Padding(
                        padding: EdgeInsets.only(top: 12),
                        child: LinearProgressIndicator(),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _useCurrentLocation() async {
    setState(() {
      _isLoading = true;
    });
    try {
      final Position position = await _service.getCurrentPosition();
      final LatLng latLng = LatLng(position.latitude, position.longitude);
      await _setSelection(latLng);
      final GoogleMapController controller = await _mapController.future;
      await controller.animateCamera(
        CameraUpdate.newLatLngZoom(latLng, 16),
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Unable to fetch location: $error')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _setSelection(LatLng latLng) async {
    setState(() {
      _selectedLatLng = latLng;
      _address = 'Loading address…';
    });
    try {
      final String? fetched =
          await _service.getAddressFromLatLng(latLng.latitude, latLng.longitude);
      setState(() {
        _address = fetched ?? '(${latLng.latitude.toStringAsFixed(4)}, '
            '${latLng.longitude.toStringAsFixed(4)})';
      });
    } catch (_) {
      setState(() {
        _address = '(${latLng.latitude.toStringAsFixed(4)}, '
            '${latLng.longitude.toStringAsFixed(4)})';
      });
    }
  }
}
