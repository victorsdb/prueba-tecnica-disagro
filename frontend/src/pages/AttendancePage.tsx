import { useState, useEffect } from 'react';

import Header from '../components/Header';
import Stepper from '../components/Stepper';
import CustomerForm from '../components/CustomerForm';
import ProductServiceSelection from '../components/ProductServiceSelection';
import RegistrationConfirmation from '../components/RegistrationConfirmation';

import { createRegistration } from '../services/registrationService';
import {
    clearSession,
    getSession,
    saveSession
} from '../services/sessionService';

import type { CustomerInfo } from '../types/attendance';
import type { Product, Service } from '../types/catalog';
import type { RegistrationResponse } from '../types/registration';

function AttendancePage() {
    const [currentStep, setCurrentStep] = useState(1);

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        firstName: '',
        lastName: '',
        email: '',
        attendanceDate: '',
    });

    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

    const [confirmedProducts, setConfirmedProducts] = useState<Product[]>([]);
    const [confirmedServices, setConfirmedServices] = useState<Service[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registration, setRegistration] = useState<RegistrationResponse | null>(null);

    const [isSessionLoaded, setIsSessionLoaded] = useState(false);

    const steps = [
        'Ingrese su información',
        'Seleccione servicios y productos de su interés'
    ];

    useEffect(() => {
        const loadSession = async () => {
            try {
                const draft = await getSession();

                if (draft) {
                    setCurrentStep(draft.currentStep ?? 1);

                    setCustomerInfo({
                        firstName: draft.firstName ?? '',
                        lastName: draft.lastName ?? '',
                        email: draft.email ?? '',
                        attendanceDate: draft.attendanceAt ?? '',
                    });

                    setSelectedProductIds(draft.productIds ?? []);
                    setSelectedServiceIds(draft.serviceIds ?? []);
                }
            } catch (error) {
                console.error('No se pudo recuperar la sesión:', error);
            } finally {
                setIsSessionLoaded(true);
            }
        };

        loadSession();
    }, []);

    useEffect(() => {
        if (!isSessionLoaded || registration) {
            return;
        }

        const hasData =
            customerInfo.firstName.trim() !== '' ||
            customerInfo.lastName.trim() !== '' ||
            customerInfo.email.trim() !== '' ||
            customerInfo.attendanceDate !== '' ||
            selectedProductIds.length > 0 ||
            selectedServiceIds.length > 0 ||
            currentStep !== 1;

        if (!hasData) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            saveSession({
                currentStep,
                firstName: customerInfo.firstName,
                lastName: customerInfo.lastName,
                email: customerInfo.email,
                attendanceAt: customerInfo.attendanceDate,
                productIds: selectedProductIds,
                serviceIds: selectedServiceIds,
            }).catch((error) => {
                console.error('No se pudo guardar la sesión:', error);
            });
        }, 500);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        currentStep,
        customerInfo,
        selectedProductIds,
        selectedServiceIds,
        isSessionLoaded,
        registration
    ]);

    const goNext = () => {
        setCurrentStep(2);
    };

    const goBack = () => {
        setCurrentStep(1);
    };

    const handleCustomerChange = (field: keyof CustomerInfo, value: string) => {
        setCustomerInfo((previousData) => ({
            ...previousData,
            [field]: value,
        }));
    };

    const handleProductToggle = (productId: number) => {
        setSelectedProductIds((currentIds) =>
            currentIds.includes(productId)
                ? currentIds.filter((id) => id !== productId)
                : [...currentIds, productId]
        );
    };

    const handleServiceToggle = (serviceId: number) => {
        setSelectedServiceIds((currentIds) =>
            currentIds.includes(serviceId)
                ? currentIds.filter((id) => id !== serviceId)
                : [...currentIds, serviceId]
        );
    };

    const handleConfirm = async (
        products: Product[],
        services: Service[]
    ) => {
        try {
            setIsSubmitting(true);

            const createdRegistration = await createRegistration({
                name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
                email: customerInfo.email,
                attendanceAt: customerInfo.attendanceDate,
                productIds: selectedProductIds,
                serviceIds: selectedServiceIds,
            });

            try {
                await clearSession();
            } catch (error) {
                console.error('No se pudo limpiar la sesión:', error);
            }

            setConfirmedProducts(products);
            setConfirmedServices(services);
            setRegistration(createdRegistration);

        } catch (error) {
            console.error('Error al confirmar asistencia:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRestart = () => {
        setCurrentStep(1);

        setCustomerInfo({
            firstName: '',
            lastName: '',
            email: '',
            attendanceDate: '',
        });

        setSelectedProductIds([]);
        setSelectedServiceIds([]);

        setConfirmedProducts([]);
        setConfirmedServices([]);

        setRegistration(null);
    };



    return (
        <>
            <Header />

            {registration ? (
                <RegistrationConfirmation
                    customerInfo={customerInfo}
                    registration={registration}
                    products={confirmedProducts}
                    services={confirmedServices}
                    onRestart={handleRestart}
                />
            ) : (
                <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Confirma tu asistencia al evento.
                        </p>
                    </div>

                    <Stepper
                        currentStep={currentStep}
                        steps={steps}
                    />

                    {currentStep === 1 && (
                        <CustomerForm
                            data={customerInfo}
                            onChange={handleCustomerChange}
                            onNext={goNext}
                        />
                    )}

                    {currentStep === 2 && (
                        <ProductServiceSelection
                            selectedProductIds={selectedProductIds}
                            selectedServiceIds={selectedServiceIds}
                            onProductToggle={handleProductToggle}
                            onServiceToggle={handleServiceToggle}
                            onBack={goBack}
                            onConfirm={handleConfirm}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </main>
            )}
        </>

    );
}

export default AttendancePage;