// Voice Customization per Character
// Extracted from agnai: TTS customization for personas

export const VoiceCustomization = ({ personaId }: { personaId: string }) => (
  <div dir="rtl">
    <h2>تخصيص الصوت | Voice Customization</h2>
    <select aria-label="اختيار لهجة | Select Dialect">
      <option value="baghdad">لهجة بغداد | Baghdad Accent</option>
      <option value="basra">لهجة البصرة | Basra Accent</option>
    </select>
  </div>
);
