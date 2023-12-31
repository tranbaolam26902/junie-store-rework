// Libraries
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLoaderData, useSearchParams } from 'react-router-dom';

// Assets
import { icons } from '@assets/icons';

// Services
import { getProductsByQueries } from '@services/client';

// Components
import { ProductItem } from '@components/client';
import { ProductFilterSection } from '@components/client/category';
import { Container, Input, Pager } from '@components/shared';
import { Fade, PageTransition } from '@components/shared/animations';

const sortOptions = [
    {
        id: 1,
        name: 'Ngày (từ mới đến cũ)',
        SortColumn: 'createDate',
        SortOrder: 'desc'
    },
    {
        id: 2,
        name: 'Ngày (từ cũ đến mới)',
        SortColumn: 'createDate',
        SortOrder: 'asc'
    },
    {
        id: 3,
        name: 'Tên (từ A - Z)',
        SortColumn: 'name',
        SortOrder: 'asc'
    },
    {
        id: 4,
        name: 'Tên (từ Z - A)',
        SortColumn: 'name',
        SortOrder: 'desc'
    },
    {
        id: 5,
        name: 'Giá (từ thấp - cao)',
        SortColumn: 'price',
        SortOrder: 'asc'
    },
    {
        id: 6,
        name: 'Giá (từ cao - thấp)',
        SortColumn: 'price',
        SortOrder: 'desc'
    }
];

export default function SearchResult() {
    // Hooks
    const [searchParams, setSearchParams] = useSearchParams();
    const { relatedCategories } = useLoaderData();

    // States
    const [showFilter, setShowFilter] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [sortType, setSortType] = useState('');
    const [productItems, setProductItems] = useState([]);
    const [metadata, setMetadata] = useState({});

    // Refs
    const sortOptionsRef = useRef(null);
    const searchInputRef = useRef(null);

    // Functions
    const filterProducts = async () => {
        const queryString = 'IsPublished=true&' + searchParams.toString();
        const result = await getProductsByQueries(queryString);

        if (result) {
            setProductItems(result.items);
            setMetadata(result.metadata);
        }
    };

    // Event handlers
    const handleShowFilter = () => {
        setShowFilter(true);
    };
    const handleHideFilter = () => {
        setShowFilter(false);
    };
    const handleToggleSortOptions = () => {
        setShowSortOptions((state) => !state);
    };
    const handleHideSortOptions = () => {
        setShowSortOptions(false);
    };
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInputRef.current.value.trim() === '') return;

        searchParams.set('Keyword', searchInputRef.current.value);
        setSearchParams(searchParams);
        searchInputRef.current.blur();
    };

    // Side effects
    /* Auto hide product filter on mobile devices */
    useEffect(() => {
        const handleShowFilterOnLargeScreen = () => {
            if (window.innerWidth >= 1024) setShowFilter(true);
            else {
                /* Prevent hiding product filter sidebar when virtual keyboard is opened */
                if (
                    window.navigator.userAgent.includes('Android') ||
                    window.navigator.userAgent.includes('webOS') ||
                    window.navigator.userAgent.includes('iPhone') ||
                    window.navigator.userAgent.includes('iPad') ||
                    window.navigator.userAgent.includes('iPod') ||
                    window.navigator.userAgent.includes('BlackBerry') ||
                    window.navigator.userAgent.includes('Windows Phone')
                )
                    return;
                setShowFilter(false);
            }
        };

        window.addEventListener('resize', handleShowFilterOnLargeScreen);
        handleShowFilterOnLargeScreen();

        return () => {
            window.removeEventListener('resize', handleShowFilterOnLargeScreen);
        };
    }, []);
    /* Hide sort options when clicking outside */
    useEffect(() => {
        const handleHideSortOptionsWhenClickOutside = (e) => {
            if (e.target.closest('button') !== sortOptionsRef.current) handleHideSortOptions();
        };

        document.addEventListener('mousedown', handleHideSortOptionsWhenClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleHideSortOptionsWhenClickOutside);
        };
    }, []);
    /* Fiter products */
    useEffect(() => {
        setSortType('Ngày (từ mới đến cũ)');
        if (searchParams.size !== 0) {
            filterProducts();

            if (searchParams.has('SortColumn', 'createDate') && searchParams.has('SortOrder', 'asc'))
                setSortType('Ngày (từ cũ đến mới)');
            else if (searchParams.has('SortColumn', 'name') && searchParams.has('SortOrder', 'asc'))
                setSortType('Tên (từ A - Z)');
            else if (searchParams.has('SortColumn', 'name') && searchParams.has('SortOrder', 'desc'))
                setSortType('Tên (từ Z - A)');
            else if (searchParams.has('SortColumn', 'price') && searchParams.has('SortOrder', 'asc'))
                setSortType('Giá (từ thấp đến cao)');
            else if (searchParams.has('SortColumn', 'price') && searchParams.has('SortOrder', 'desc'))
                setSortType('Giá (từ cao đến thấp)');
        }
        // eslint-disable-next-line
    }, [searchParams]);

    return (
        <PageTransition>
            <Container>
                <div className='flex flex-col gap-8 mt-8 mb-12 md:mb-14 xl:mb-16'>
                    <h1 className='font-garamond text-4xl md:text-5xl xl:text-6xl text-center'>
                        Kết quả cho từ khóa &quot;{searchParams.get('Keyword')}&quot;
                    </h1>
                    <form className='flex items-center gap-2 mx-auto w-full md:w-96' onSubmit={handleSearch}>
                        <Input ref={searchInputRef} />
                        <button
                            type='submit'
                            title='Tìm kiếm'
                            className='p-3.5 rounded border-2 border-gray transition duration-200 hover:bg-gray/30'
                        >
                            <img src={icons.search} alt='search-icon' className='w-4' />
                        </button>
                    </form>
                </div>
                <div className='flex gap-10 mb-8'>
                    {/* Start: Sidebar section */}
                    <ProductFilterSection show={showFilter} onHide={handleHideFilter} categories={relatedCategories} />
                    {/* End: Sidebar section */}

                    {/* Start: Main section */}
                    <section className='flex-1 flex flex-col gap-4 md:gap-6'>
                        {/* Start: Main's header section */}
                        <section className='flex flex-col md:flex-row md:items-center justify-between gap-2'>
                            <div className='flex items-center gap-1'>
                                <button type='button' className='lg:hidden p-2' onClick={handleShowFilter}>
                                    <img src={icons.filter} alt='filter-icon' className='w-4' />
                                </button>
                                <span className='font-thin tracking-wider'>{metadata.totalItemCount} sản phẩm</span>
                            </div>
                            <div className='relative flex items-center gap-2 pl-2 md:pl-0'>
                                <span className='font-thin tracking-wider'>Sắp xếp theo</span>
                                <button
                                    ref={sortOptionsRef}
                                    type='button'
                                    className='relative top-px flex items-center gap-1'
                                    onClick={handleToggleSortOptions}
                                >
                                    <span>{sortType}</span>
                                    <img
                                        src={icons.caretDown}
                                        alt='caret-down-icon'
                                        className={`w-4 transition-transform duration-200${
                                            showSortOptions ? ' rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {showSortOptions && (
                                        <Fade className='absolute top-full right-0 z-10 flex flex-col items-start p-4 w-max font-thin bg-primary rounded shadow'>
                                            {sortOptions.map((sortOption) => (
                                                <button
                                                    key={sortOption.id}
                                                    type='button'
                                                    className='px-4 py-1 w-full text-left rounded transition duration-200 hover:bg-gray/50'
                                                    onClick={() => {
                                                        searchParams.set('SortColumn', sortOption.SortColumn);
                                                        searchParams.set('SortOrder', sortOption.SortOrder);
                                                        setSearchParams(searchParams, { replace: true });
                                                    }}
                                                >
                                                    {sortOption.name}
                                                </button>
                                            ))}
                                        </Fade>
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>
                        {/* End: Main's header section */}

                        {/* Start: Product section */}
                        <section className='grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-x-2 md:gap-x-6 gap-y-8 xl:gap-y-12'>
                            {productItems.map(
                                (product) => product.active && <ProductItem key={product.id} product={product} />
                            )}
                        </section>
                        {/* End: Product section */}

                        {/* Start: Pager section */}
                        <Pager metadata={metadata} />
                        {/* End: Pager section */}
                    </section>
                    {/* End: Main section */}
                </div>
            </Container>
        </PageTransition>
    );
}
