const Button = ({
  children,
  onClick = () => {},
  type = "button",
  className,
}) => {
  return (
    <button
      className={`font-medium ${className} text-white`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
