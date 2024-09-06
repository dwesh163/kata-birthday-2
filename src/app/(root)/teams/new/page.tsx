'use client';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { User } from '@/types';
import { LogOut, Plus } from 'lucide-react';
import { UnitSearch } from '@/components/unitSearch';
import { UserSearch } from '@/components/userSearch';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'name must be at least 2 characters.',
	}),
});

export default function NewTeamPage() {
	const [users, setUsers] = useState<User[]>([]);

	const t = useTranslations('NewTeam');
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		console.log(users);

		fetch('/api/team', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: values.name,
				users: users,
			}),
		}).then((response) => {
			if (!response.ok) {
				console.error('Failed to create team:', response.statusText);
			} else {
				router.push('/teams');
			}
		});
	}

	function onUserSelect(user: User) {
		if (users.find((u) => u.email === user.email)) {
			return;
		}

		setUsers([...users, user]);
	}

	function onUserRemove(email: string) {
		setUsers(users.filter((u) => u.email !== email));
	}

	return (
		<div className="w-full h-full">
			<Breadcrumb className="px-10 pt-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/teams">Teams</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>New</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="flex-1 bg-background p-6 md:p-10 h-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex justify-between items-center mb-6">
							<h1 className="font-semibold text-[30px]">{t('title')}</h1>

							<Button type="submit">
								<Plus className="mr-1 h-4 w-4" />
								{t('submit')}
							</Button>
						</div>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('name.label')}</FormLabel>
									<FormControl>
										<Input placeholder={t('name.placeholder')} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<Table className="mt-8">
					<TableHeader>
						<TableRow className="hover:bg-white">
							<TableHead className="w-max">{t('table.name')}</TableHead>
							<TableHead className="w-3/5">{t('table.unit')}</TableHead>
							<TableHead className="w-[150px]">{t('table.actions.title')}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id} className="hover:bg-white">
								<TableCell className="w-max font-medium">{user.name}</TableCell>
								<TableCell className="text-gray-700">{user.unit ? user.unit : t('content.out')}</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<TooltipProvider delayDuration={300}>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button variant="outline" size="icon" onClick={() => onUserRemove(user.email)}>
														<LogOut className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>{t('table.actions.remove')}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className="w-full flex items-center justify-center gap-2 mt-6">
					<Dialog>
						<DialogTrigger asChild>
							<Button>{t('table.import.one')}</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[625px] gap-0">
							<DialogHeader>
								<DialogTitle>{t('import.one.title')}</DialogTitle>
								<DialogDescription>{t('import.one.description')}</DialogDescription>
							</DialogHeader>
							<UserSearch onSelect={onUserSelect} />
						</DialogContent>
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<Button disabled>{t('table.import.unit')}</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[625px] gap-0">
							<DialogHeader>
								<DialogTitle>{t('import.unit.title')}</DialogTitle>
								<DialogDescription>{t('import.unit.description')}</DialogDescription>
							</DialogHeader>
							<UnitSearch />
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
}
