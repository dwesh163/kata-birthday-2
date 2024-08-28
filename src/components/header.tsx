import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import LanguageSelector from '@/components/languageSelector';

export function Header() {
	return (
		<header className="text-primary-secondary sm:py-4 sm:px-6 py-2 px-3 flex items-center justify-between border-b-2 border-0">
			<div className="flex items-center sm:gap-4 gap-3 sm:p-3 p-2">
				<img src="https://epfl-si.github.io/elements/svg/epfl-logo.svg" alt="Birthminder" className="sm:h-7 h-5" />
				<span className="border-l-2 border-solid h-6 w-1 border-gray-300"></span>
				<h1 className="sm:text-2xl text-xl font-semibold">Birthminder</h1>
			</div>
			<LanguageSelector />
			<Button variant="ghost">
				<PlusIcon className="w-5 h-5" />
				<span className="sr-only">Add Team Member</span>
			</Button>
		</header>
	);
}
