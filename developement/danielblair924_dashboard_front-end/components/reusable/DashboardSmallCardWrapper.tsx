function DashboardSmallCardWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative p-6 backdrop-blur-2xl rounded-2xl bg-[#070a03] border border-borderColor overflow-hidden flex flex-col justify-between  hover:border-[#385315] transition-all duration-300 cursor-pointer shadow-lg shadow-black/50 ${className}`}
    >
      {/* Green Corner Glow Effect */}
      <div
        className="absolute -top-10 -right-14 w-55 h-32 rounded-full pointer-events-none blur-2xl opacity-65"
        style={{
          background:
            "radial-gradient(circle, #5b8915 0%, #34500c 40%, transparent 65%)",
        }}
      />
      {children}
    </div>
  );
}

export default DashboardSmallCardWrapper;
