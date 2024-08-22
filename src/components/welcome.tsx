import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { FilePen, PenIcon } from 'lucide-react';

export default function Welcome() {
	return (
		<div className="flex-1 bg-background p-6 md:p-10">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Upcoming Birthdays</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="flex items-center gap-4">
								<Avatar>
									<AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">John Doe</p>
									<p className="text-muted-foreground text-sm">Marketing Team</p>
									<p className="text-muted-foreground text-sm">Birthday: June 15</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<Avatar>
									<AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
									<AvatarFallback>SA</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">Sarah Anderson</p>
									<p className="text-muted-foreground text-sm">Design Team</p>
									<p className="text-muted-foreground text-sm">Birthday: August 22</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<Avatar>
									<AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
									<AvatarFallback>MJ</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">Michael Johnson</p>
									<p className="text-muted-foreground text-sm">Engineering Team</p>
									<p className="text-muted-foreground text-sm">Birthday: November 3</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Teams</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="flex items-center gap-4">
								<Avatar>
									<AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
									<AvatarFallback>MT</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">Marketing Team</p>
									<p className="text-muted-foreground text-sm">5 members</p>
								</div>
								<Button variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-gray-500">
									<FilePen className="w-5 h-5" />
									<span className="sr-only">Edit</span>
								</Button>
							</div>
							<div className="flex items-center gap-4">
								<Avatar>
									<AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
									<AvatarFallback>DT</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">Design Team</p>
									<p className="text-muted-foreground text-sm">3 members</p>
								</div>
								<Button variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-gray-500">
									<FilePen className="w-5 h-5" />
									<span className="sr-only">Edit</span>
								</Button>
							</div>
							<div className="flex items-center gap-4">
								<Avatar>
									<AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
									<AvatarFallback>ET</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">Engineering Team</p>
									<p className="text-muted-foreground text-sm">7 members</p>
								</div>
								<Button variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-gray-500">
									<FilePen className="w-5 h-5" />
									<span className="sr-only">Edit</span>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Notification Settings</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="flex items-center justify-between">
								<p>Upcoming Birthdays</p>
								<Switch />
							</div>
							<div className="flex items-center justify-between">
								<p>Birthday Reminders</p>
								<Switch />
							</div>
							<div className="flex items-center justify-between">
								<p>Email Notifications</p>
								<Switch />
							</div>
							<div className="flex items-center justify-between">
								<p>Push Notifications</p>
								<Switch />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
