export default function WizardShell({
  icon,
  stepLabel,
  description,
  totalSteps,
  currentStep,
  instructions,
  children,
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Continue",
  nextDisabled = false,
}) {
  return (
    <div className="reg-wrap">
      <div className="step-box">
        <div className="step-icon"><i className={icon}></i></div>
        <div className="step-content">
          <h2>{stepLabel}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="step-progress">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`step-dot ${i < currentStep ? "active" : ""}`}></div>
        ))}
      </div>

      <div className="form-box">
        {instructions && (
          <div className="instructions">
            <strong>Instructions:</strong> {instructions}
          </div>
        )}

        {children}

        <div className="button-box">
          {onBack && (
            <button type="button" className="btn-outline" onClick={onBack}>
              {backLabel}
            </button>
          )}
          {onNext && (
            <button type="button" className="btn-purple" onClick={onNext} disabled={nextDisabled}>
              {nextLabel} <i className="bi bi-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
