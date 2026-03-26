import React, { useState } from 'react';
import type { Settings } from '../types';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function SettingsPanel({ settings, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const update = (key: keyof Settings, value: number | boolean | string) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#94a3b8',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <span>Settings</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
      </button>

      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
          <SliderControl
            label="User typing speed"
            value={settings.userTypingSpeed}
            min={10}
            max={100}
            unit="ms/char"
            onChange={(v) => update('userTypingSpeed', v)}
          />
          <SliderControl
            label="AI typing speed"
            value={settings.aiTypingSpeed}
            min={10}
            max={80}
            unit="ms/word"
            onChange={(v) => update('aiTypingSpeed', v)}
          />
          <SliderControl
            label="Thinking duration"
            value={settings.thinkingDuration}
            min={500}
            max={5000}
            step={100}
            unit="ms"
            onChange={(v) => update('thinkingDuration', v)}
          />
          <SliderControl
            label="End hold duration"
            value={settings.endHoldDuration}
            min={500}
            max={5000}
            step={100}
            unit="ms"
            onChange={(v) => update('endHoldDuration', v)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#cbd5e1' }}>Show user typing animation</span>
            <button
              onClick={() => update('showUserTyping', !settings.showUserTyping)}
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: settings.showUserTyping ? '#3b82f6' : '#475569',
                position: 'relative',
                transition: 'background-color 0.2s',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: 2,
                  left: settings.showUserTyping ? 20 : 2,
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#cbd5e1' }}>Video quality</span>
            <select
              value={settings.videoQuality}
              onChange={(e) => update('videoQuality', e.target.value)}
              style={{
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #334155',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: 12,
              }}
            >
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ color: '#94a3b8' }}>
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#3b82f6' }}
      />
    </div>
  );
}
