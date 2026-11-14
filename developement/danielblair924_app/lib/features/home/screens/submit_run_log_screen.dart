import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../core/extensions/extensions.dart';
import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/utils/utils.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/widgets.dart';
import '../providers/submission_provider.dart';
import '../widgets/widgets.dart';

class SubmitRunLogScreen extends ConsumerStatefulWidget {
  const SubmitRunLogScreen({super.key});

  @override
  ConsumerState<SubmitRunLogScreen> createState() => _SubmitRunLogScreenState();
}

class _SubmitRunLogScreenState extends ConsumerState<SubmitRunLogScreen> {
  late final TextEditingController _distanceController;
  late final TextEditingController _dateController;
  late final TextEditingController _durationController;

  var _selectedUnit = DistanceUnit.km;
  double _distance = 0.0;
  DateTime? _selectedDate;

  @override
  void initState() {
    super.initState();
    final draft = ref.read(runSubmissionProvider);

    _selectedUnit = draft.unit;
    _distance = draft.distance;
    _selectedDate = draft.selectedDate;

    _distanceController = TextEditingController(
      text: draft.distance > 0 ? draft.distance.toString() : '',
    );
    _dateController = TextEditingController(
      text: DateFormat('MMM dd, yyyy').format(draft.selectedDate),
    );
    _durationController = TextEditingController(
      text: draft.duration,
    );
  }

  @override
  void dispose() {
    _distanceController.dispose();
    _dateController.dispose();
    _durationController.dispose();
    super.dispose();
  }

  void _selectDate(DateTime date) {
    setState(() {
      _selectedDate = date;
      _dateController.text = DateFormat('MMM dd, yyyy').format(date);
    });
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      _selectDate(picked);
    }
  }

  void _onContinue() {
    if (_distance <= 0.0 || _selectedDate == null) return;

    ref.read(runSubmissionProvider.notifier).setLogDetails(
      distance: _distance,
      unit: _selectedUnit,
      date: _selectedDate!,
      duration: _durationController.text.trim(),
    );

    context.push(AppRoutes.submitRunProof);
  }

  @override
  Widget build(BuildContext context) {
    final draft = ref.watch(runSubmissionProvider);
    final isButtonDisabled = _distance <= 0.0 || _selectedDate == null;
    final linkedLabel = draft.linkedTitle.toUpperCase();

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
      ),
      extendBody: true,
      extendBodyBehindAppBar: true,
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
            padding: EdgeInsets.symmetric(
              horizontal: AppStyles.paddingScreenHorizontal,
            ),
            child: Column(
              spacing: 16.h,
              children: [
                Column(
                  children: [
                    const SectionIntro(title: 'Log your run'),
                    4.height,
                    Container(
                      margin: .only(bottom: 16.h),
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(AppStyles.cardBorderRadius),
                        border: Border.all(width: 1, color: AppColors.primary),
                      ),
                      child: Text(
                        'FOR: $linkedLabel',
                        style: context.bodySmall.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),

                // Distance Section
                AppCard(
                  child: Column(
                    spacing: 12,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const InputLabel('Distance'),
                      KmDistanceInputField(
                        controller: _distanceController,
                        unit: _selectedUnit,
                        onChanged: (val) {
                          setState(() {
                            _distance = val;
                          });
                        },
                        onUnitChanged: (newUnit) {
                          setState(() {
                            _selectedUnit = newUnit;
                          });
                        },
                      ),
                    ],
                  ),
                ),

                // Date Section
                AppCard(
                  child: Column(
                    spacing: 12,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const InputLabel('Date'),
                      TextField(
                        controller: _dateController,
                        readOnly: true,
                        onTap: _pickDate,
                        decoration: InputDecoration(
                          hintText: 'Select Date',
                          suffixIconConstraints: const BoxConstraints(
                            minWidth: 40,
                            minHeight: 24,
                          ),
                          suffixIcon: GestureDetector(
                            onTap: _pickDate,
                            child: SvgIcon(
                              Assets.icons.calendar,
                              color: AppColors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Duration Section (Optional)
                AppCard(
                  child: Column(
                    spacing: 12,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const InputLabel('Duration', hintText: '(Optional)'),
                      TextField(
                        controller: _durationController,
                        keyboardType: TextInputType.number,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          _TimeInputFormatter(),
                        ],
                        decoration: InputDecoration(
                          hintText: 'HH:MM:SS',
                          suffixIconConstraints: const BoxConstraints(
                            minWidth: 40,
                            minHeight: 24,
                          ),
                          suffixIcon: SvgIcon(
                            Assets.icons.clock,
                            color: AppColors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                Container(
                  margin: const EdgeInsets.only(top: 8),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(
                      AppStyles.cardBorderRadius + 4,
                    ),
                    border: Border(
                      left: BorderSide(
                        color: context.scheme.primary,
                        width: 4.0,
                      ),
                    ),
                  ),
                  child: ListTile(
                    tileColor: AppColors.elevated,
                    shape: AppRoundedBorder(),
                    leading: AppIconBox(
                      size: 50,
                      child: SvgIcon(
                        Assets.icons.link,
                        size: 32,
                        color: AppColors.primary,
                      ),
                    ),
                    title: const Padding(
                      padding: EdgeInsets.only(bottom: 4),
                      child: Text('Linked to:'),
                    ),
                    subtitle: Text(draft.linkedTitle, overflow: TextOverflow.ellipsis),
                    titleTextStyle: context.bodySmall,
                    subtitleTextStyle: context.titleMedium,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          bottom: Utils.bottomPaddingInset(context),
        ),
        child: AppButton(
          isDisabled: isButtonDisabled,
          onPressed: isButtonDisabled ? null : _onContinue,
          child: const Text('Continue'),
        ),
      ),
    );
  }
}

/// Automatically formats raw numeric input into HH:MM:SS pattern
class _TimeInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    var digits = newValue.text.replaceAll(':', '');
    if (digits.length > 6) {
      digits = digits.substring(0, 6);
    }

    final buffer = StringBuffer();
    for (int i = 0; i < digits.length; i++) {
      if (i == 2 || i == 4) {
        buffer.write(':');
      }
      buffer.write(digits[i]);
    }

    final formattedText = buffer.toString();

    return TextEditingValue(
      text: formattedText,
      selection: TextSelection.collapsed(offset: formattedText.length),
    );
  }
}
