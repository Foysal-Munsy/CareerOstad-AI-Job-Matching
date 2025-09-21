import React from 'react';

const Logo = () => {
    return (
        <>
            <div className="flex items-center space-x-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg shadow-button">CO</div><div className="hidden sm:block"><h1 className="text-xl font-bold text-primary">CareerOstad</h1><p className="text-xs text-muted-foreground -mt-1 font-light">AI-Powered Career Guidance</p></div></div>
        </>
    );
};

export default Logo;