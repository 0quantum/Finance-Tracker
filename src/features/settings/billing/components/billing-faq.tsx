// src/features/billing/components/billing-faq.tsx

const FAQ = [
  {
    q: "Що відбувається після закінчення пробного періоду?",
    a: "Автоматично списується оплата за обраним тарифом. Ви можете скасувати до кінця пробного.",
  },
  {
    q: "Чи можна перейти з місячного на річний тариф?",
    a: "Так, будь-коли через Stripe Portal — різниця буде зарахована пропорційно.",
  },
  {
    q: "Що включає Lifetime?",
    a: "Всі поточні та майбутні функції Pro назавжди — без жодних повторних платежів.",
  },
  {
    q: "Що станеться з даними після скасування?",
    a: "Дані зберігаються. Доступ обмежується до ліміту Free плану.",
  },
];

export function BillingFaq() {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/10 p-5 flex flex-col gap-4">
      <p className="text-sm font-semibold">Часті запитання</p>
      {FAQ.map((item) => (
        <div key={item.q} className="border-t border-border/40 pt-4 first:border-0 first:pt-0">
          <p className="text-sm font-medium mb-1">{item.q}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
        </div>
      ))}
    </div>
  );
}