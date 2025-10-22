import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import 'package:vibe_guard/models/quiet_period.dart';

class QuietPeriodTile extends StatelessWidget {
  const QuietPeriodTile({
    super.key,
    required this.period,
    required this.onEdit,
    required this.onDelete,
  });

  final QuietPeriod period;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final String formattedRange = _formatRange(period.startMinutes, period.endMinutes);
    final String days = period.daysOfWeek.isEmpty
        ? 'Every day'
        : period.daysOfWeek.map(_weekdayLabel).join(', ');

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).colorScheme.primaryContainer,
          child: const Icon(Icons.schedule, color: Colors.black87),
        ),
        title: Text(period.label),
        subtitle: Text('$formattedRange · $days'),
        trailing: Wrap(
          spacing: 8,
          children: <Widget>[
            IconButton(
              onPressed: onEdit,
              icon: const Icon(Icons.edit_outlined),
            ),
            IconButton(
              onPressed: onDelete,
              icon: const Icon(Icons.delete_outline),
            ),
          ],
        ),
      ),
    );
  }

  String _formatRange(int startMinutes, int endMinutes) {
    final DateFormat format = DateFormat.jm();
    final DateTime now = DateTime.now();
    final DateTime start = DateTime(now.year, now.month, now.day)
        .add(Duration(minutes: startMinutes));
    final DateTime end = DateTime(now.year, now.month, now.day)
        .add(Duration(minutes: endMinutes));
    return '${format.format(start)} – ${format.format(end)}';
  }

  String _weekdayLabel(int value) {
    const List<String> weekdays = <String>[
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ];
    if (value < 1 || value > 7) {
      return 'Day $value';
    }
    return weekdays[value - 1];
  }
}

class QuietPeriodDialog extends StatefulWidget {
  const QuietPeriodDialog({super.key, required this.period});

  final QuietPeriod? period;

  @override
  State<QuietPeriodDialog> createState() => _QuietPeriodDialogState();
}

class _QuietPeriodDialogState extends State<QuietPeriodDialog> {
  late final TextEditingController _labelController;
  late int _startMinutes;
  late int _endMinutes;
  late Set<int> _selectedDays;

  @override
  void initState() {
    super.initState();
    _labelController = TextEditingController(text: widget.period?.label ?? 'Quiet period');
    _startMinutes = widget.period?.startMinutes ?? 8 * 60;
    _endMinutes = widget.period?.endMinutes ?? 9 * 60;
    _selectedDays = widget.period?.daysOfWeek.toSet() ?? <int>{1, 2, 3, 4, 5};
  }

  @override
  void dispose() {
    _labelController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.period == null ? 'Add quiet period' : 'Edit quiet period'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            TextField(
              controller: _labelController,
              decoration: const InputDecoration(labelText: 'Label'),
            ),
            const SizedBox(height: 12),
            _TimeRangePicker(
              startMinutes: _startMinutes,
              endMinutes: _endMinutes,
              onChanged: (int start, int end) {
                setState(() {
                  _startMinutes = start;
                  _endMinutes = end;
                });
              },
            ),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: List<Widget>.generate(7, (int index) {
                  final int dayValue = index + 1;
                  final bool selected = _selectedDays.contains(dayValue);
                  const List<String> labels = <String>['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  return FilterChip(
                    label: Text(labels[index]),
                    selected: selected,
                    onSelected: (bool value) {
                      setState(() {
                        if (value) {
                          _selectedDays.add(dayValue);
                        } else {
                          _selectedDays.remove(dayValue);
                        }
                      });
                    },
                  );
                }),
              ),
            ),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () {
            Navigator.of(context).pop(
              QuietPeriod(
                label: _labelController.text.trim().isEmpty
                    ? 'Quiet period'
                    : _labelController.text.trim(),
                startMinutes: _startMinutes,
                endMinutes: _endMinutes,
                daysOfWeek: _selectedDays,
              ),
            );
          },
          child: const Text('Save'),
        ),
      ],
    );
  }
}

class _TimeRangePicker extends StatelessWidget {
  const _TimeRangePicker({
    required this.startMinutes,
    required this.endMinutes,
    required this.onChanged,
  });

  final int startMinutes;
  final int endMinutes;
  final void Function(int start, int end) onChanged;

  @override
  Widget build(BuildContext context) {
    final TimeOfDay start = TimeOfDay(hour: startMinutes ~/ 60, minute: startMinutes % 60);
    final TimeOfDay end = TimeOfDay(hour: endMinutes ~/ 60, minute: endMinutes % 60);

    return Row(
      children: <Widget>[
        Expanded(
          child: _TimeButton(
            label: 'Start',
            value: start,
            onSelected: (TimeOfDay value) {
              onChanged(value.hour * 60 + value.minute, endMinutes);
            },
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _TimeButton(
            label: 'End',
            value: end,
            onSelected: (TimeOfDay value) {
              onChanged(startMinutes, value.hour * 60 + value.minute);
            },
          ),
        ),
      ],
    );
  }
}

class _TimeButton extends StatelessWidget {
  const _TimeButton({
    required this.label,
    required this.value,
    required this.onSelected,
  });

  final String label;
  final TimeOfDay value;
  final ValueChanged<TimeOfDay> onSelected;

  @override
  Widget build(BuildContext context) {
    final DateFormat format = DateFormat.jm();
    final DateTime now = DateTime.now();
    final DateTime time = DateTime(now.year, now.month, now.day, value.hour, value.minute);

    return FilledButton.tonal(
      onPressed: () async {
        final TimeOfDay? picked = await showTimePicker(
          context: context,
          initialTime: value,
          helpText: label,
        );
        if (picked != null) {
          onSelected(picked);
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label),
          const SizedBox(height: 4),
          Text(format.format(time)),
        ],
      ),
    );
  }
}
