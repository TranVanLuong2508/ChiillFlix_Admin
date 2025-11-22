import AdminHeader from '@/components/admin/layout/AdminHeader'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full w-full">
      <AdminHeader />

      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default layout