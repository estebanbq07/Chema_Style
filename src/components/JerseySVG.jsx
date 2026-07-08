export default function JerseySVG({ color, num, stroke, dark }) {
  const textColor = dark ? '#1B2420' : '#F5F7F2'
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M60 10 L20 40 L35 65 L55 55 L55 200 Q100 210 145 200 L145 55 L165 65 L180 40 L140 10 Q100 25 60 10 Z"
        fill={color}
        stroke={stroke ? '#F5F7F2' : 'none'}
        strokeWidth={stroke ? 2 : 0}
      />
      <text x="100" y="140" fontFamily="Anton" fontSize="60" fill={textColor} textAnchor="middle">
        {num}
      </text>
    </svg>
  )
}
