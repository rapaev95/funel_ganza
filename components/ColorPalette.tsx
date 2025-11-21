interface ColorPaletteProps {
  colors: string[]
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  return (
    <div className="color-palette">
      <div className="palette-title">Твоя палитра</div>
      <div className="palette-colors">
        {colors.map((color, index) => (
          <div
            key={index}
            className="color-swatch"
            style={{ background: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}


