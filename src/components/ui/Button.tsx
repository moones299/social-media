type Props = {
  children: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({ children, onClick, disabled = false }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-11 w-full rounded-xl bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
