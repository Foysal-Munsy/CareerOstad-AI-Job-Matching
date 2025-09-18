import React from 'react';

const Logo = () => {
    return (
        <>
            <div class="flex items-center space-x-3"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg shadow-button">CO</div><div class="hidden sm:block"><h1 class="text-xl font-bold text-primary">CareerOstad</h1><p class="text-xs text-muted-foreground -mt-1">AI-Powered Career Guidance</p></div></div>
        </>
    );
};

export default Logo;