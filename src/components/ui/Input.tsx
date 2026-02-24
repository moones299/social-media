type Props = {
  label: string;
  type?: string;
  placeholder?: string;
  variant?: "outline" | "filled";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export default function Input({
  label,
  type = "text",
  placeholder,
  variant = "filled",
  value,
  onChange,
  disabled = false,
}: Props) {
  const inputClass =
    variant === "filled"
      ? "h-11 rounded-xl bg-blue-50 border border-transparent px-4 outline-none focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder:text-gray-500 disabled:opacity-50"
      : "h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black disabled:opacity-50";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-800 font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClass}
      />
    </div>
  );
}
