import './SkeletonDashboard.css';

const SkeletonDashboard = () => {
    return (
        <div className="skeleton-dashboard">
            {/* Header Skeleton */}
            <div className="skeleton-header">
                <div className="skeleton-header-row">
                    <div className="skeleton skeleton-title"></div>
                </div>
                <div className="skeleton skeleton-user"></div>
            </div>

            <div className="skeleton-main">
                {/* Sidebar Skeleton (Hidden on Mobile) */}
                <div className="skeleton-sidebar">
                    <div className="skeleton" style={{ height: '32px', width: '120px' }}></div>
                    <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '6px' }}></div>

                    <div style={{ marginTop: '1rem' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton skeleton-list-item"></div>
                        ))}
                    </div>
                </div>

                {/* Main Panel Skeleton */}
                <div className="skeleton-panel">
                    {/* Panel Header (Total Card + Title) */}
                    <div className="skeleton skeleton-panel-header"></div>

                    {/* Product List/Table */}
                    <div className="skeleton-table">
                        <div className="skeleton" style={{ height: '32px', width: '200px', marginBottom: '1rem' }}></div>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="skeleton skeleton-row"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonDashboard;
