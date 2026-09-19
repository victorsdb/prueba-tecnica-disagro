interface StepperProps {
    currentStep: number;
    steps: string[];
}

function Stepper({ currentStep, steps }: StepperProps) {
    return (
        <div className="my-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-0">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;

                return (
                    <div
                        key={step}
                        className="flex w-full items-center sm:w-auto"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-semibold sm:h-10 sm:w-10
                                        ${isActive || isCompleted
                                        ? 'border-green-600 bg-green-600 text-white'
                                        : 'border-gray-300 bg-white text-gray-500'
                                    }
                                        `}
                            >
                                {stepNumber}
                            </div>

                            <span className="whitespace-pre-line text-sm font-semibold leading-tight text-gray-800 sm:max-w-47.5">
                                {step}
                            </span>
                        </div>


                        {index < steps.length - 1 && (
                            <div className="mx-5 hidden h-px w-20 bg-gray-300 sm:block" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Stepper;