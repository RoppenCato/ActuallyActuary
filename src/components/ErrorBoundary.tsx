import { Component, type ReactNode } from 'react'

type State = { error: Error | null }

/** Shows the error on screen instead of a blank page, so it can be reported. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }
  static getDerivedStateFromError(error: Error): State { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-5xl">💥</div>
        <h1 className="text-xl font-bold">Något gick fel</h1>
        <pre className="max-w-full overflow-auto rounded-xl bg-white/5 p-3 text-left text-xs text-rose-200">
          {this.state.error.message}
          {'\n'}
          {this.state.error.stack?.split('\n').slice(0, 4).join('\n')}
        </pre>
        <p className="text-sm text-slate-400">Skicka en skärmdump av det här till Claude.</p>
        <a href="#/" className="btn-primary" onClick={() => setTimeout(() => location.reload(), 50)}>Till startsidan</a>
      </div>
    )
  }
}
