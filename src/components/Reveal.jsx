import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Pembungkus animasi "muncul saat di-scroll".
 *
 * Dirender sebagai elemen apa pun lewat prop `as`, jadi bisa langsung menggantikan
 * elemen aslinya (article, li, Link, ...) tanpa menambah wrapper yang merusak layout.
 *
 *   <Reveal as="article" className="reason-card" variant="up" delay={80}>...</Reveal>
 *
 * `variant`: up | left | right | zoom | fade
 * `delay`  : jeda dalam milidetik, dipakai untuk efek berurutan pada grid.
 */
export default function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  style,
  children,
  ...rest
}) {
  const [ref, isVisible] = useScrollReveal();

  const classes = ['reveal', `reveal--${variant}`, isVisible ? 'is-visible' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      className={classes}
      style={delay ? { ...style, animationDelay: `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Jeda berurutan untuk item grid, dibatasi supaya item terakhir tidak terlalu lama menunggu. */
export const staggerDelay = (index, step = 70, max = 420) => Math.min(index * step, max);
