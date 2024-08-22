import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusIcon } from 'lucide-react';

export function Header() {
	return (
		<header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<CalendarIcon className="w-6 h-6" />
				<h1 className="text-2xl font-bold">Birthminder</h1>
			</div>
			<Button variant="ghost">
				<PlusIcon className="w-5 h-5" />
				<span className="sr-only">Add Team Member</span>
			</Button>
		</header>
	);
}
