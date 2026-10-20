type ReceiptProps = {
  title: string;
  period: string;
  items: readonly string[];
  included: string;
  totalLabel: string;
  totalValue: string;
};

export function Receipt({ title, period, items, included, totalLabel, totalValue }: ReceiptProps) {
  return (
    <div data-receipt className="receipt relative bg-bone p-6 text-ink sm:p-8">
      <div className="flex justify-between border-b border-dashed border-ink/30 pb-3 font-semibold">
        <span>{title}</span>
        <span>{period}</span>
      </div>
      <ul className="py-2">
        {items.map((item) => (
          <li data-item key={item} className="flex justify-between gap-4 py-2 text-[0.9375rem]">
            <span>{item}</span>
            <span className="text-ink/55">{included}</span>
          </li>
        ))}
      </ul>
      <div data-total className="flex items-baseline justify-between border-t border-ink pt-3">
        <span>{totalLabel}</span>
        <span className="text-[clamp(1.75rem,1rem+2vw,2.5rem)] font-bold tracking-[-0.04em]">{totalValue}</span>
      </div>
    </div>
  );
}
