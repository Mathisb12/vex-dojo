import { useState, useMemo } from 'react'
import type { MCQExercise, MCQChoice } from '../exercises/types'
import { useLang } from '../i18n/LanguageContext'
import { ExerciseHeader } from './ExerciseHeader'

interface Props {
  exercise: MCQExercise
  icon: string
  onComplete: (xp: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function MCQQuestion({ exercise, icon, onComplete }: Props) {
  const { t } = useLang()
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [shake, setShake] = useState(false)

  // Shuffle choice order once per exercise so the correct answer isn't always first
  const choices = useMemo(() => shuffle(exercise.choices), [exercise.id])

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
    const choice = choices[idx]
    if (choice.correct) {
      setAnswered(true)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }

  const handleContinue = () => onComplete(exercise.xp)

  const getChoiceStyle = (idx: number, choice: MCQChoice) => {
    const base = 'w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 font-sans text-sm'
    if (!answered) {
      if (selected === idx) return `${base} border-vex-orange bg-vex-orange/10 text-vex-text`
      return `${base} border-vex-border bg-vex-surface hover:border-vex-orange/50 hover:bg-vex-surface/80 text-vex-text cursor-pointer`
    }
    if (choice.correct) return `${base} border-vex-green bg-vex-green/10 text-vex-green`
    if (selected === idx && !choice.correct) return `${base} border-vex-red bg-vex-red/10 text-vex-red`
    return `${base} border-vex-border bg-vex-surface text-vex-muted opacity-60`
  }

  return (
    <div className={`flex flex-col gap-5 ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
      <ExerciseHeader kind="mcq" icon={icon}>{exercise.title}</ExerciseHeader>

      {/* Choices */}
      <div className="flex flex-col gap-2">
        {choices.map((choice, idx) => (
          <button key={idx} className={getChoiceStyle(idx, choice)} onClick={() => handleSelect(idx)}>
            <span className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{choice.text}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {answered && (
        <div className="bg-vex-green/10 border border-vex-green rounded-xl p-4 animate-[slideIn_0.3s_ease-out]">
          <div className="text-vex-green font-semibold mb-1">{t('mcq.correct')} +{exercise.xp} XP</div>
          <p className="text-vex-text/80 text-sm text-pretty"
            dangerouslySetInnerHTML={{ __html: exercise.explanation.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code class="bg-black/30 px-1 rounded text-vex-orange font-mono text-xs">$1</code>') }}
          />
          {selected !== null && choices[selected]?.explanation && (
            <p className="text-vex-muted text-xs mt-2 italic">{choices[selected].explanation}</p>
          )}
          <button
            onClick={handleContinue}
            className="mt-3 px-5 py-2 bg-vex-green text-black font-semibold rounded-lg hover:bg-vex-green/90 transition-colors text-sm"
          >
            {t('common.continue')}
          </button>
        </div>
      )}

      {selected !== null && !answered && (
        <div className="bg-vex-red/10 border border-vex-red rounded-xl p-3 text-vex-red text-sm">
          {t('mcq.tryAgain')}
        </div>
      )}
    </div>
  )
}
