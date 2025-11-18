export function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-orange-50/40 dark:bg-background">
       {/* Círculo superior esquerdo */}
       <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[100px]" />
       
       {/* Círculo inferior direito */}
       <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-300/20 rounded-full blur-[100px]" />
       
       {/* Círculo central suave */}
       <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-rose-300/10 rounded-full blur-[80px]" />
    </div>
  );
}