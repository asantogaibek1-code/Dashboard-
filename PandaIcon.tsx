/**
 * Маскот-панда для логотипа и фоновые силуэты
 * Использует сгенерированные PNG-изображения
 */

/**
 * Главная панда-маскот для логотипа
 */
export function PandaMascot({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src="https://image.qwenlm.ai/generated-images/05d6ed56-3a2f-417f-b734-4d2c6ac5b5ea/_result.png"
      alt="Панда маскот"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      loading="lazy"
    />
  );
}

/**
 * Силуэт панды, едящей бамбук
 */
export function PandaSilhouetteBamboo({ className = "" }: { className?: string }) {
  return (
    <img
      src="https://image.qwenlm.ai/generated-images/638c48af-a776-48dd-bc00-85c453d578e5/_result.png"
      alt=""
      width={150}
      height={150}
      className={`object-contain ${className}`}
      loading="lazy"
      aria-hidden
    />
  );
}

/**
 * Силуэт панды, машущей рукой
 */
export function PandaSilhouetteWaving({ className = "" }: { className?: string }) {
  return (
    <img
      src="https://image.qwenlm.ai/generated-images/b35b5a2f-6bbc-4782-b2fa-3cdca7e596f0/_result.png"
      alt=""
      width={150}
      height={150}
      className={`object-contain ${className}`}
      loading="lazy"
      aria-hidden
    />
  );
}

/**
 * Силуэт спящей панды
 */
export function PandaSilhouetteSleeping({ className = "" }: { className?: string }) {
  return (
    <img
      src="https://image.qwenlm.ai/generated-images/f34f33f0-9ed0-4eef-8118-b8726954402c/_result.png"
      alt=""
      width={150}
      height={150}
      className={`object-contain ${className}`}
      loading="lazy"
      aria-hidden
    />
  );
}

/**
 * Мини-панда для footer и тостов
 */
export function PandaMini({ className = "" }: { className?: string }) {
  return (
    <PandaMascot size={24} className={className} />
  );
}
