import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';

class LocationService {
  const LocationService();

  Future<Position> getCurrentPosition() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      serviceEnabled = await Geolocator.openLocationSettings();
      if (!serviceEnabled) {
        throw StateError('Location services are disabled');
      }
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw StateError('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw StateError('Location permissions are permanently denied');
    }

    return Geolocator.getCurrentPosition();
  }

  Future<String?> getAddressFromPosition(Position position) async {
    return getAddressFromLatLng(position.latitude, position.longitude);
  }

  Future<String?> getAddressFromLatLng(double latitude, double longitude) async {
    final List<Placemark> placemarks = await placemarkFromCoordinates(
      latitude,
      longitude,
    );
    if (placemarks.isEmpty) {
      return null;
    }
    final Placemark place = placemarks.first;
    return [
      place.name,
      place.street,
      place.locality,
      place.administrativeArea,
    ].where((String? value) => value != null && value!.isNotEmpty).join(', ');
  }

  Future<Location?> geocodeAddress(String address) async {
    final List<Location> locations = await locationFromAddress(address);
    if (locations.isEmpty) {
      return null;
    }
    return locations.first;
  }
}
