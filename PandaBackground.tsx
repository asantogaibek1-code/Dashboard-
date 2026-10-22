import { PandaSilhouetteBamboo, PandaSilhouetteWaving, PandaSilhouetteSleeping } from "./PandaIcon";

/**
 * Фоновый слой с силуэтными пандами
 * Разбросаны по экрану с минимальной прозрачностью
 */
export function PandaBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
      {/* Верхний левый угол — панда с бамбуком */}
      <div className="absolute -left-16 -top-10 opacity-[0.03] rotate-[-12deg]">
        <PandaSilhouetteBamboo className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]" />
      </div>

      {/* Верхний правый угол — машущая панда */}
      <div className="absolute -right-10 top-16 opacity-[0.025] rotate-[8deg]">
        <PandaSilhouetteWaving className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]" />
      </div>

      {/* Центр слева — спящая панда */}
      <div className="absolute left-[5%] top-[40%] opacity-[0.02] rotate-[-5deg] hidden md:block">
        <PandaSilhouetteSleeping className="w-[170px] h-[170px]" />
      </div>

      {/* Центр справа — панда с бамбуком */}
      <div className="absolute right-[8%] top-[55%] opacity-[0.025] rotate-[15deg] hidden md:block">
        <PandaSilhouetteBamboo className="w-[160px] h-[160px]" />
      </div>

      {/* Нижний левый угол — машущая панда */}
      <div className="absolute -left-8 bottom-8 opacity-[0.02] rotate-[10deg]">
        <PandaSilhouetteWaving className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px]" />
      </div>

      {/* Нижний правый угол — спящая панда */}
      <div className="absolute -right-12 bottom-16 opacity-[0.03] rotate-[-8deg]">
        <PandaSilhouetteSleeping className="w-[170px] h-[170px] sm:w-[200px] sm:h-[200px]" />
      </div>

      {/* Дополнительные панды для больших экранов */}
      <div className="absolute left-[25%] top-[12%] opacity-[0.018] hidden lg:block">
        <PandaSilhouetteWaving className="w-[120px] h-[120px] rotate-[5deg]" />
      </div>

      <div className="absolute right-[30%] top-[72%] opacity-[0.018] hidden lg:block">
        <PandaSilhouetteBamboo className="w-[130px] h-[130px] rotate-[-10deg]" />
      </div>
    </div>
  );
}
