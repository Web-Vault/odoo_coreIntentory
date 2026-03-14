import React from 'react';

const ForecastBar = ({ forecast, onToast }) => {
  return (
    <div className="forecast-bar">
      {forecast.map((f, idx) => (
        <div key={idx} className="fb-col" onClick={() => onToast(f.day, f.desc, f.color === 'roast' ? 'warn' : 'success')}>
          <div 
            className="fb-bar" 
            style={{ 
              height: `${f.value}px`, 
              background: `var(--${f.color})`,
              border: f.border ? `1px solid var(--${f.border})` : 'none'
            }} 
          />
          <div className="fb-label">{f.day}</div>
        </div>
      ))}
    </div>
  );
};

export default ForecastBar;
