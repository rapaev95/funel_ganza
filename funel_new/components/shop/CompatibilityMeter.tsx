'use client'

interface CompatibilityMeterProps {
  percentage: number
  archetype?: string
}

export function CompatibilityMeter({ percentage, archetype }: CompatibilityMeterProps) {
  return (
    <div className="compatibility-meter">
      <div className="compatibility-meter-header">
        <h3 className="compatibility-meter-title">Совместимость</h3>
        <span className="compatibility-meter-percentage">{percentage}%</span>
      </div>
      
      <div className="compatibility-meter-bar">
        <div 
          className="compatibility-meter-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {archetype && (
        <p className="compatibility-meter-description">
          Эти товары идеально подходят вашему архетипу <strong>{archetype}</strong>
        </p>
      )}
    </div>
  )
}


