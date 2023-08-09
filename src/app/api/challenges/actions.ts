'use server';

import { Middleware, admin } from '@/lib/Middleware';
import { Category, Difficulty } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createChallenge(data: FormData) {
    let middleware = await Middleware([admin()]);
    if (middleware) return middleware;

    await prisma.challenge.create({
        data: {
            name: data.get('name')?.toString()!,
            description: data.get('description')?.toString()!,
            files: data.get('files')?.toString()!.split(','),
            image: data.get('image')?.toString()!,
            flag: data.get('flag')?.toString()!,
            category: data.get('category')?.toString()! as Category,
            difficulty: data.get('difficulty')?.toString()! as Difficulty,
            solved: undefined,
            staticPoints: parseInt(data.get('staticPoints')?.toString()!),
        },
    });

    revalidatePath('/admin/challenges');
}

export async function editChallenge(data: FormData) {
    let middleware = await Middleware([admin()]);
    if (middleware) return middleware;

    await prisma.challenge.update({
        where: {
            id: data.get('id')?.toString(),
        },
        data: {
            name: data.get('name')?.toString()!,
            description: data.get('description')?.toString()!,
            files: data.get('files')?.toString()!.split(','),
            image: data.get('image')?.toString()!,
            flag: data.get('flag')?.toString()!,
            category: data.get('category')?.toString()! as Category,
            difficulty: data.get('difficulty')?.toString()! as Difficulty,
            solved: undefined,
            staticPoints: parseInt(data.get('staticPoints')?.toString()!),
        },
    });

    revalidatePath('/admin/challenges');
}

export async function deleteChallenge(data: FormData) {
    let middleware = await Middleware([admin()]);
    if (middleware) return middleware;

    await prisma.challenge.delete({
        where: {
            id: data.get('id')?.toString(),
        },
    });

    revalidatePath('/admin/challenges');
}
