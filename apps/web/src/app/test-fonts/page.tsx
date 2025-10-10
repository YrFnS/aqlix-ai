/**
 * Arabic Fonts Test Page
 *
 * Visual verification page for the Arabic font system.
 * Tests all three Arabic fonts (Noto Sans Arabic, Cairo, Amiri) with:
 * - Multiple font sizes
 * - Different line heights
 * - Letter spacing variations
 * - Mixed Arabic-English content
 * - Responsive behavior
 * - Dark mode support
 *
 * Navigate to /test-fonts to view this page.
 */

export default function TestFontsPage() {
  const arabicSample = "مرحباً بكم في نظام الدردشة الذكي العراقي";
  const formalSample = "بسم الله الرحمن الرحيم";
  const longText =
    "هذا نص طويل لاختبار قابلية القراءة في نظام الخطوط العربية. يستخدم هذا النظام ثلاثة خطوط مختلفة لأغراض مختلفة: خط نوتو العربي للنصوص العامة، وخط القاهرة للعناوين، وخط أميري للنصوص الرسمية.";

  return (
    <div className="container-responsive py-8 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Arabic Fonts Test Page</h1>
        <p className="text-lg text-muted-foreground">
          Visual verification of the Iraqi AI Chat System font system
        </p>
      </div>

      {/* Primary Font: Noto Sans Arabic */}
      <section className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-gray-600 dark:text-gray-300">
            Primary Font: Noto Sans Arabic
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            CSS Variable:{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              --font-arabic-primary
            </code>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tailwind Class:{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              font-arabic
            </code>
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">XS (14px)</p>
            <p className="font-arabic text-xs-arabic">{arabicSample}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">SM (16px)</p>
            <p className="font-arabic text-sm-arabic">{arabicSample}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Base (18px) - Default</p>
            <p className="font-arabic text-base-arabic">{arabicSample}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">LG (20px)</p>
            <p className="font-arabic text-lg-arabic">{arabicSample}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">XL (24px)</p>
            <p className="font-arabic text-xl-arabic">{arabicSample}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">2XL (30px)</p>
            <p className="font-arabic text-2xl-arabic">{arabicSample}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">3XL (36px)</p>
            <p className="font-arabic text-3xl-arabic">{arabicSample}</p>
          </div>
        </div>
      </section>

      {/* Heading Font: Cairo */}
      <section className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-4">
        <div className="border-b border-blue-200 dark:border-blue-800 pb-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
            Heading Font: Cairo
          </h2>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            CSS Variable:{" "}
            <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
              --font-arabic-heading
            </code>
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Tailwind Class:{" "}
            <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
              font-arabic-heading
            </code>
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">H1 - Bold</p>
            <h1 className="font-arabic-heading text-3xl-arabic leading-tight-arabic font-bold">
              عنوان رئيسي كبير جداً
            </h1>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">H2 - Semibold</p>
            <h2 className="font-arabic-heading text-2xl-arabic leading-snug-arabic font-semibold">
              عنوان فرعي متوسط الحجم
            </h2>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">H3 - Medium</p>
            <h3 className="font-arabic-heading text-xl-arabic font-medium">
              عنوان صغير بخط متوسط
            </h3>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Navigation Item</p>
            <nav className="font-arabic-heading text-lg-arabic font-medium">
              الصفحة الرئيسية | المستندات | الإعدادات
            </nav>
          </div>
        </div>
      </section>

      {/* Formal Font: Amiri */}
      <section className="border-2 border-green-200 dark:border-green-800 rounded-lg p-6 space-y-4">
        <div className="border-b border-green-200 dark:border-green-800 pb-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-green-600 dark:text-green-400">
            Formal Font: Amiri
          </h2>
          <p className="text-sm text-green-600 dark:text-green-400">
            CSS Variable:{" "}
            <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
              --font-arabic-formal
            </code>
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Tailwind Class:{" "}
            <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
              font-arabic-formal
            </code>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Traditional Opening</p>
            <p className="font-arabic-formal text-lg-arabic leading-relaxed-arabic">
              {formalSample}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Formal Document Text</p>
            <p className="font-arabic-formal text-base-arabic leading-relaxed-arabic">
              نص رسمي بخط أميري الأنيق للوثائق القانونية والنصوص التقليدية. هذا
              الخط مناسب للمستندات الحكومية والرسائل الرسمية.
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Legal Text (Loose Spacing)
            </p>
            <p className="font-arabic-formal text-base-arabic leading-loose-arabic">
              {longText}
            </p>
          </div>
        </div>
      </section>

      {/* Line Height Examples */}
      <section className="border-2 border-purple-200 dark:border-purple-800 rounded-lg p-6 space-y-6">
        <div className="border-b border-purple-200 dark:border-purple-800 pb-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-purple-600 dark:text-purple-400">
            Line Heights
          </h2>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Testing different line height values for Arabic text
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">
              Tight (1.4) - For Headings
            </p>
            <p className="font-arabic text-base-arabic leading-tight-arabic">
              {arabicSample} {arabicSample}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Snug (1.5) - For Compact Content
            </p>
            <p className="font-arabic text-base-arabic leading-snug-arabic">
              {arabicSample} {arabicSample}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Normal (1.6) - Default for Body Text
            </p>
            <p className="font-arabic text-base-arabic leading-normal-arabic">
              {arabicSample} {arabicSample}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Relaxed (1.7) - For Formal Documents
            </p>
            <p className="font-arabic text-base-arabic leading-relaxed-arabic">
              {arabicSample} {arabicSample}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Loose (1.8) - For Educational Content
            </p>
            <p className="font-arabic text-base-arabic leading-loose-arabic">
              {arabicSample} {arabicSample}
            </p>
          </div>
        </div>
      </section>

      {/* Letter Spacing Examples */}
      <section className="border-2 border-orange-200 dark:border-orange-800 rounded-lg p-6 space-y-6">
        <div className="border-b border-orange-200 dark:border-orange-800 pb-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-orange-600 dark:text-orange-400">
            Letter Spacing
          </h2>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Testing different letter spacing values for Arabic text
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Tighter (-0.02em)</p>
            <p className="font-arabic text-base-arabic tracking-tighter-arabic">
              {arabicSample}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Tight (-0.01em)</p>
            <p className="font-arabic text-base-arabic tracking-tight-arabic">
              {arabicSample}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Normal (0em) - Default for Arabic
            </p>
            <p className="font-arabic text-base-arabic tracking-normal-arabic">
              {arabicSample}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Wide (0.02em) - For Small Text
            </p>
            <p className="font-arabic text-sm-arabic tracking-wide-arabic">
              {arabicSample}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Wider (0.04em) - For Very Small Text
            </p>
            <p className="font-arabic text-xs-arabic tracking-wider-arabic">
              {arabicSample}
            </p>
          </div>
        </div>
      </section>

      {/* Mixed Content */}
      <section className="border-2 border-pink-200 dark:border-pink-800 rounded-lg p-6 space-y-4">
        <div className="border-b border-pink-200 dark:border-pink-800 pb-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-pink-600 dark:text-pink-400">
            Mixed Arabic-English Content
          </h2>
          <p className="text-sm text-pink-600 dark:text-pink-400">
            Testing bilingual content with proper font switching
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Email Address</p>
            <p className="font-arabic text-base-arabic leading-normal-arabic">
              <span>البريد الإلكتروني: </span>
              <span className="font-sans">user@example.com</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Date</p>
            <p className="font-arabic text-base-arabic leading-normal-arabic">
              <span>تاريخ اليوم: </span>
              <span className="font-sans">
                {new Date().toLocaleDateString()}
              </span>
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">URL</p>
            <p className="font-arabic text-base-arabic leading-normal-arabic">
              <span>الموقع الإلكتروني: </span>
              <span className="font-sans">https://iraqi-ai-chat.com</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Mixed Sentence</p>
            <p className="font-arabic text-base-arabic leading-normal-arabic">
              <span>مرحباً بك في </span>
              <span className="font-sans">Iraqi AI Chat System</span>
              <span> نظام الدردشة الذكي</span>
            </p>
          </div>
        </div>
      </section>

      {/* Long Text Readability */}
      <section className="border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <div className="border-b border-indigo-200 dark:border-indigo-800 pb-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-indigo-600 dark:text-indigo-400">
            Long Text Readability
          </h2>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            Testing readability with longer paragraphs
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">
              Primary Font - Normal Spacing
            </p>
            <p className="font-arabic text-base-arabic leading-normal-arabic">
              {longText} {longText}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Heading Font - Tight Spacing
            </p>
            <p className="font-arabic-heading text-lg-arabic leading-tight-arabic">
              {longText}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Formal Font - Relaxed Spacing
            </p>
            <p className="font-arabic-formal text-base-arabic leading-relaxed-arabic">
              {longText}
            </p>
          </div>
        </div>
      </section>

      {/* Font Feature Settings Visualization */}
      <section className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2">Font Feature Settings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All Arabic fonts have ligatures, contextual alternates, and kerning
            enabled
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">
              Ligatures Enabled (Default)
            </p>
            <p className="font-arabic text-xl-arabic">
              لا إله إلا الله محمد رسول الله
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Contextual Forms</p>
            <p className="font-arabic text-xl-arabic">بسم الله الرحمن الرحيم</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Connected Script</p>
            <p className="font-arabic text-xl-arabic">الحمد لله رب العالمين</p>
          </div>
        </div>
      </section>

      {/* DevTools Info */}
      <section className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-semibold mb-4">DevTools Verification</h2>
        <div className="space-y-2 text-sm font-mono">
          <p>
            <strong>Check these in DevTools → Computed:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>--font-arabic-primary: Should show Noto Sans Arabic</li>
            <li>--font-arabic-heading: Should show Cairo</li>
            <li>--font-arabic-formal: Should show Amiri</li>
          </ul>
          <p className="mt-4">
            <strong>Check these in DevTools → Network:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>NotoSansArabic-*.woff2 (Status: 200 OK)</li>
            <li>Cairo-*.woff2 (Status: 200 OK)</li>
            <li>Amiri-*.woff2 (Status: 200 OK when formal text loads)</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
