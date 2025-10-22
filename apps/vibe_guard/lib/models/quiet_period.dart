import 'dart:convert';

class QuietPeriod {
  QuietPeriod({
    required this.label,
    required this.startMinutes,
    required this.endMinutes,
    this.daysOfWeek = const <int>{},
  });

  final String label;
  final int startMinutes;
  final int endMinutes;
  final Set<int> daysOfWeek;

  QuietPeriod copyWith({
    String? label,
    int? startMinutes,
    int? endMinutes,
    Set<int>? daysOfWeek,
  }) {
    return QuietPeriod(
      label: label ?? this.label,
      startMinutes: startMinutes ?? this.startMinutes,
      endMinutes: endMinutes ?? this.endMinutes,
      daysOfWeek: daysOfWeek ?? this.daysOfWeek,
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'label': label,
      'startMinutes': startMinutes,
      'endMinutes': endMinutes,
      'daysOfWeek': daysOfWeek.toList(),
    };
  }

  static QuietPeriod fromMap(Map<String, dynamic> map) {
    return QuietPeriod(
      label: map['label'] as String? ?? 'Quiet Period',
      startMinutes: map['startMinutes'] as int? ?? 0,
      endMinutes: map['endMinutes'] as int? ?? 60,
      daysOfWeek: <int>{
        for (final Object? value in (map['daysOfWeek'] as List<dynamic>? ?? <dynamic>[]))
          if (value is int) value,
      },
    );
  }

  String toJson() => jsonEncode(toMap());

  static QuietPeriod fromJson(String source) =>
      QuietPeriod.fromMap(jsonDecode(source) as Map<String, dynamic>);
}
