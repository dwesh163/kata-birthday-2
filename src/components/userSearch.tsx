import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslations } from 'next-intl';

interface UserType {
	name: string;
	unit: string;
	email: string;
	jobTitle: string;
	image: string;
}

export function UserSearch({ onSelect }: { onSelect: (user: any) => void }) {
	const [users, setUsers] = useState<UserType[]>([]);
	const [search, setSearch] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const t = useTranslations('NewTeam.import.one');

	async function fetchUser(search: string) {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(`/api/users?search=${search}`);
			if (!response.ok) throw new Error('Network response was not ok.');
			const data = await response.json();
			setUsers(data);
		} catch (error) {
			console.error('Failed to fetch users:', error);
			setError('Failed to fetch users.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Input
				placeholder={t('placeholder')}
				value={search}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						fetchUser(search);
					}
				}}
				onChange={(e) => setSearch(e.target.value)}
				className="sm:mt-4 mt-2"
			/>
			<div className="grid gap-1 h-[30vh]">
				<div className="flex flex-col">
					{loading ? (
						<p className="flex justify-center items-center w-full h-full">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						</p>
					) : error ? (
						<div className="flex justify-center items-center w-full h-full">
							<p className="text-red-600">{error}</p>
						</div>
					) : users.length > 0 ? (
						<ScrollArea className="h-[29vh] w-full mt-5">
							{users.map((user: UserType, userIndex: number) => (
								<div key={'UserSearch' + userIndex} className="flex items-center justify-between sm:mb-4 mb-2">
									<div className="sm:space-x-4 space-x-2 flex items-center">
										<Avatar>
											<AvatarImage src={user.image} />
											<AvatarFallback>
												{user.name
													.split(' ')
													.slice(0, 2)
													.map((word) => word.charAt(0).toUpperCase())
													.join('')}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="text-sm font-medium leading-none truncate">{user.name}</p>
											<p className="text-sm text-muted-foreground truncate sm:max-w-[20rem] max-w-[8rem]">
												{user.unit} {user.jobTitle && `- ${user.jobTitle}`}
											</p>
										</div>
									</div>
									<TooltipProvider delayDuration={300}>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button variant="outline" size="icon" onClick={() => onSelect(user)}>
													<UserRoundPlus className="size-4 ml-0.5" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p> {t('select')}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							))}
						</ScrollArea>
					) : (
						<p className="flex justify-center items-center w-full h-full">No users available</p>
					)}
				</div>
			</div>
		</>
	);
}
