import React from 'react';

export const RenderEmail: React.FC<{ email: any }> = ({ email }: { email: any }) => {

    return (
        <iframe style={{ border: 'none', width: "70%" }} srcDoc={decodeURIComponent(escape(atob(email.payload.parts[1].body.data.replace(/-/g, '+').replace(/_/g, '/'))))} title="Email"></iframe>
    )
}