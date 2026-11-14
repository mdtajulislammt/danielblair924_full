import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:first_mile_club/main.dart';

void main() {
  testWidgets('App builds and renders', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MyApp(),
      ),
    );
    await tester.pump();

    expect(find.byType(MyApp), findsOneWidget);
  });
}
