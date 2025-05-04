import 'package:flutter/material.dart';

class NotificationPreference extends StatefulWidget {
  final String title;
  final bool initialValue;
  final bool isSmallScreen;
  final Function(bool) onChanged;

  const NotificationPreference({
    Key? key,
    required this.title,
    required this.initialValue,
    required this.isSmallScreen,
    required this.onChanged,
  }) : super(key: key);

  @override
  State<NotificationPreference> createState() => _NotificationPreferenceState();
}

class _NotificationPreferenceState extends State<NotificationPreference> {
  late bool isEnabled;

  @override
  void initState() {
    super.initState();
    isEnabled = widget.initialValue;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: widget.isSmallScreen ? 8.0 : 12.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              widget.title,
              style: TextStyle(fontSize: widget.isSmallScreen ? 13 : 14),
              overflow: TextOverflow.ellipsis,
              maxLines: 2,
            ),
          ),
          Transform.scale(
            scale: widget.isSmallScreen ? 0.8 : 1.0,
            child: Switch(
              value: isEnabled,
              onChanged: (value) {
                setState(() {
                  isEnabled = value;
                });
                widget.onChanged(value);
              },
            ),
          ),
        ],
      ),
    );
  }
}