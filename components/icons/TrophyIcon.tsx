
import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 1 0-19.5h9a9.75 9.75 0 0 1 0 19.5ZM10.5 6h3m-6.75 3.375-1.5-1.5m9 1.5 1.5-1.5M12 12.75v6.75m-4.5-3.75h9" />
    </svg>
);

export default TrophyIcon;
