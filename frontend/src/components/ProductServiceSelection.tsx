import {
    useEffect,
    useState,
} from 'react';

import {
    ArrowLeft,
    ArrowRight,
    Search,
    CircleHelp,
    LoaderCircle,
    AlertCircle,
} from 'lucide-react';

import { getProducts, getServices } from '../services/catalogService';

import type { Product, Service } from '../types/catalog';

import { calculateProductDiscount, calculateServiceDiscount } from '../utils/discounts';

interface ProductServiceSelectionProps {
    selectedProductIds: number[];
    selectedServiceIds: number[];
    onProductToggle: (productId: number) => void;
    onServiceToggle: (serviceId: number) => void;
    onBack: () => void;
    onConfirm: (
        products: Product[],
        services: Service[]
    ) => void;
    isSubmitting: boolean;
}

function ProductServiceSelection({
    selectedProductIds,
    selectedServiceIds,
    onProductToggle,
    onServiceToggle,
    onBack,
    onConfirm,
    isSubmitting,
}: ProductServiceSelectionProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [services, setServices] = useState<Service[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const [showEmptySelectionModal, setShowEmptySelectionModal] = useState(false);

    const loadCatalog = async () => {
        try {
            setLoading(true);
            setError('');

            const [productsData, servicesData] = await Promise.all([
                getProducts(),
                getServices(),
            ]);

            setProducts(productsData);
            setServices(servicesData);

        } catch (error) {
            console.error(error);
            setError('No se pudo cargar el catálogo');

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCatalog();
    }, []);

    const selectedProducts = products.filter((product) =>
        selectedProductIds.includes(product.id)
    );

    const selectedServices = services.filter((service) =>
        selectedServiceIds.includes(service.id)
    );

    const productSubtotal = selectedProducts.reduce(
        (total, product) => total + Number(product.price),
        0
    );

    const serviceSubtotal = selectedServices.reduce(
        (total, service) => total + Number(service.price),
        0
    );

    const productDiscount = calculateProductDiscount(
        selectedProducts.length
    );

    const serviceDiscount = calculateServiceDiscount(
        selectedServices.length,
        serviceSubtotal
    );

    if (loading) {
        return (
            <section className="mx-auto w-full max-w-xl">
                <div className="flex h-[60dvh] items-center justify-center rounded-2xl bg-white shadow-sm">

                    <div className="text-center">
                        <LoaderCircle
                            size={36}
                            className="mx-auto animate-spin text-green-600"
                        />

                        <p className="mt-3 text-sm font-medium text-gray-600">
                            Cargando catálogo...
                        </p>
                    </div>

                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mx-auto w-full max-w-xl">
                <div className="flex h-[60dvh] items-center justify-center rounded-2xl bg-white p-6 shadow-sm">

                    <div className="max-w-sm text-center">

                        <AlertCircle
                            size={40}
                            className="mx-auto text-red-500"
                        />

                        <h2 className="mt-4 font-semibold text-gray-800">
                            No pudimos cargar el catálogo
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Verifica tu conexión e inténtalo nuevamente.
                        </p>

                        <button
                            type="button"
                            onClick={loadCatalog}
                            className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                            Reintentar
                        </button>

                    </div>

                </div>
            </section>
        );
    }

    const getProductDiscountMessage = () => {
        const count = selectedProducts.length;

        if (count >= 5) {
            return 'Ya obtuviste el descuento máximo de 5% en productos.';
        }

        if (count >= 3) {
            const remaining = 5 - count;

            return `Selecciona ${remaining} producto${remaining > 1 ? 's' : ''} más para obtener 5% de descuento.`;
        }

        const remaining = 3 - count;

        return `Selecciona ${remaining} producto${remaining > 1 ? 's' : ''} más para obtener 3% de descuento.`;
    };

    const getServiceDiscountMessage = () => {
        const count = selectedServices.length;

        if (count >= 2 && serviceSubtotal > 1500) {
            return 'Ya obtuviste el descuento máximo de 5% en servicios.';
        }

        if (count >= 2) {
            return 'Supera Q1,500.00 en servicios para obtener 5% de descuento.';
        }

        const remaining = 2 - count;

        return `Selecciona ${remaining} servicio${remaining > 1 ? 's' : ''} más para obtener descuento.`;
    };

    const normalizeText = (text: string) =>
        text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

    const normalizedSearch = normalizeText(searchTerm.trim());

    const filteredServices = services.filter((service) =>
        normalizeText(service.name).includes(normalizedSearch)
    );

    const filteredProducts = products.filter((product) =>
        normalizeText(product.name).includes(normalizedSearch)
    );

    const handleConfirmClick = () => {
        if (selectedProducts.length === 0 && selectedServices.length === 0) {
            setShowEmptySelectionModal(true);
            return;
        }

        onConfirm(selectedProducts, selectedServices);
    };

    return (
        <>

            <section className="mx-auto w-full max-w-xl">

                <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm md:h-[60dvh]">

                    {/* Buscador */}
                    <div className="bg-zinc-700 p-5">

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Buscar servicios o productos..."
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none
                                bg-white
                                transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                    </div>

                    <div className="flex min-h-0 flex-1 flex-col p-6">

                        {/* Información descuentos */}
                        <div className="group relative mb-4 flex shrink-0 justify-end">

                            <button
                                type="button"
                                aria-describedby="discount-tooltip"
                                className=" flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                            >
                                <CircleHelp size={17} />
                                ¡Obtén más descuento!
                            </button>

                            <div
                                id="discount-tooltip"
                                role="tooltip"
                                className="
                                    pointer-events-none 
                                    absolute right-0 top-full z-30 mt-2 
                                    hidden w-80 
                                    rounded-lg bg-zinc-800/90 backdrop-blur-sm px-4 py-3 
                                    text-xs text-white shadow-lg 
                                    group-hover:block 
                                    group-focus-within:block
                                "
                            >

                                <p className="mb-2 font-semibold">
                                    Descuentos disponibles
                                </p>

                                {/* Flechita */}
                                <div
                                    className="absolute bottom-full right-6 border-4 border-transparent border-b-zinc-800"
                                />

                                <p>
                                    <span className="font-semibold">Servicios:</span>{' '}
                                    {getServiceDiscountMessage()}
                                </p>

                                <p className="mt-1">
                                    <span className="font-semibold">Productos:</span>{' '}
                                    {getProductDiscountMessage()}
                                </p>


                            </div>

                        </div>

                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">

                            {/* Servicios */}
                            <details
                                name="catalog"
                                open
                                className="overflow-hidden rounded-xl border border-gray-200"
                            >

                                <summary className="cursor-pointer bg-gray-50 px-5 py-4 font-semibold text-gray-700">
                                    Servicios ({selectedServices.length} seleccionados)
                                </summary>

                                <div className="divide-y divide-gray-200 px-4 py-2">

                                    {filteredServices.length === 0 ? (
                                        <p className="py-4 text-center text-sm text-gray-500">
                                            No se encontraron servicios.
                                        </p>
                                    ) : (
                                        filteredServices.map((service) => (
                                            <label
                                                key={service.id}
                                                className="flex cursor-pointer items-center justify-between border-gray-200 px-4 py-2 transition last:border-b-0 hover:bg-green-50 gap-3"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedServiceIds.includes(service.id)}
                                                        onChange={() => onServiceToggle(service.id)}
                                                        className="h-5 w-5 accent-green-600"
                                                    />

                                                    <span className="font-medium text-gray-700">
                                                        {service.name}
                                                    </span>

                                                </div>
                                                <span className="shrink-0 font-semibold text-gray-600">
                                                    Q{Number(service.price).toFixed(2)}
                                                </span>

                                            </label>
                                        ))

                                    )}

                                </div>

                            </details>

                            {/* Productos */}
                            <details
                                name="catalog"
                                className="overflow-hidden rounded-xl border border-gray-200"
                            >

                                <summary className="cursor-pointer bg-gray-50 px-5 py-4 font-semibold text-gray-700">
                                    Productos ({selectedProducts.length} seleccionados)
                                </summary>

                                <div className="divide-y divide-gray-200 px-4 py-2">

                                    {filteredProducts.length === 0 ? (
                                        <p className="py-4 text-center text-sm text-gray-500">
                                            No se encontraron productos.
                                        </p>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <label
                                                key={product.id}
                                                className="flex cursor-pointer items-center justify-between border-gray-200 px-4 py-2 transition last:border-b-0 hover:bg-green-50 gap-3"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProductIds.includes(product.id)}
                                                        onChange={() => onProductToggle(product.id)}
                                                        className="h-5 w-5 accent-green-600"
                                                    />
                                                    <span className="font-medium text-gray-700">
                                                        {product.name}
                                                    </span>
                                                </div>

                                                <span className="shrink-0 font-semibold text-gray-600">
                                                    Q{Number(product.price).toFixed(2)}
                                                </span>
                                            </label>
                                        ))
                                    )}

                                </div>

                            </details>
                        </div>
                    </div>

                    {/* Resumen de Descuentos */}
                    <div className="grid w-full gap-4 bg-zinc-700 p-5 text-white sm:grid-cols-2">

                        <div className="space-y-1 sm:pr-6">
                            <p className="font-bold uppercase">Resumen Servicios</p>
                            <p className="flex items-center justify-between gap-4 text-sm">
                                <span>Descuento obtenido:</span>
                                <span className="font-bold text-green-600">
                                    {serviceDiscount}%
                                </span>
                            </p>

                            <p className="flex items-center justify-between gap-4 text-sm">
                                <span>Subtotal:</span>
                                <span className="font-bold">
                                    Q{serviceSubtotal.toFixed(2)}
                                </span>
                            </p>
                        </div>

                        <div className="space-y-1 border-t border-zinc-500 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                            <p className="font-bold uppercase">Resumen Productos</p>
                            <p className="flex items-center justify-between gap-4 text-sm">
                                <span>Descuento obtenido:</span>
                                <span className="font-bold text-green-600">
                                    {productDiscount}%
                                </span>
                            </p>

                            <p className="flex items-center justify-between gap-4 text-sm">
                                <span>Subtotal:</span>
                                <span className="font-bold">
                                    Q{productSubtotal.toFixed(2)}
                                </span>
                            </p>
                        </div>

                    </div>


                </div>

                <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <button
                        type="button"
                        onClick={onBack}
                        className="
                            flex w-full items-center justify-center gap-2
                            rounded-lg bg-green-600 px-6 py-3
                            font-semibold text-white transition
                            hover:bg-green-700
                            sm:w-auto
                        "
                    >
                        <ArrowLeft size={18} />
                        Anterior
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirmClick}
                        disabled={isSubmitting}
                        className="
                            flex w-full items-center justify-center gap-2
                            rounded-lg bg-indigo-600 px-6 py-3
                            font-semibold text-white transition
                            hover:bg-indigo-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            sm:w-auto
                        "
                    >
                        {isSubmitting ? (
                            'Confirmando...'
                        ) : (
                            <>
                                Confirmar asistencia
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>

            </section>

            {showEmptySelectionModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="empty-selection-title"
                >
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                        <div className="flex items-start gap-4">
                            <CircleHelp
                                size={28}
                                className="mt-0.5 shrink-0 text-indigo-600"
                            />

                            <div>
                                <h2
                                    id="empty-selection-title"
                                    className="text-lg font-semibold text-gray-800"
                                >
                                    No has seleccionado productos o servicios
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Puedes confirmar tu asistencia sin seleccionar productos
                                    o servicios de interés. ¿Deseas continuar?
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => setShowEmptySelectionModal(false)}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Volver
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowEmptySelectionModal(false);
                                    onConfirm(selectedProducts, selectedServices);
                                }}
                                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Continuar
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </>
    );
}

export default ProductServiceSelection;