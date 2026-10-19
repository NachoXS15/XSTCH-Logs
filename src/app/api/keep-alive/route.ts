import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Evita que Next cachee la respuesta: tiene que pegarle a la DB en cada ejecución.
export const dynamic = 'force-dynamic'

/**
 * Keep-alive para Supabase (plan free pausa el proyecto tras 7 días sin actividad).
 * Lo dispara el cron de Vercel definido en vercel.json cada 5 días.
 * Hace un COUNT(*) liviano (head: true → no devuelve filas, solo el conteo).
 */
export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET
    if (!secret) {
        // Sin CRON_SECRET, Vercel no manda el header y el endpoint siempre daría 401.
        return NextResponse.json({ ok: false, error: 'CRON_SECRET no configurado' }, { status: 500 })
    }

    if (request.headers.get('authorization') !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Cliente sin cookies: el cron no tiene sesión de usuario.
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false } }
    )

    const { count, error } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

    if (error) {
        console.error('[keep-alive] error:', error.message)
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    console.log(`[keep-alive] ok, clients count = ${count}`)
    return NextResponse.json({ ok: true, count, timestamp: new Date().toISOString() })
}
