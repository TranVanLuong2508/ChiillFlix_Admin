import AdminHeader from '@/components/admin/layout/AdminHeader'

import { ScrollArea } from "@/components/ui/scroll-area"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <AdminHeader />
      <ScrollArea className="min-h-[calc(100vh-71px)] bg-gray-50 overflow-y-hidden">
        <main className="flex-1 overflow-auto p-6 pb-2 ">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </ScrollArea>
    </div>
  )
}

export default layout