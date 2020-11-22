import React from 'react';

export const RenderEmail: React.FC<{ email: any }> = ({ email }: { email: any }) => {

    return (
        <iframe style={{ border: 'none', width: "100%", height: "1000px" }} srcDoc={decodeURIComponent(escape(atob(email.payload.parts[1].body.data.replace(/-/g, '+').replace(/_/g, '/'))))} title="Email"></iframe>
    )
}