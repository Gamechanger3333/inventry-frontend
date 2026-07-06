/**
 * api-hooks.ts
 * Replaces @workspace/api-client-react with direct fetch + TanStack Query hooks.
 * All hooks follow the same API contract as the original workspace package.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  emailVerified?: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  cost: number;
  categoryId?: string;
  category?: Category;
  stock?: number;
  imageUrl?: string;
  createdAt: string;
}

export interface ProductInput {
  name: string;
  sku: string;
  description?: string;
  price: number;
  cost: number;
  categoryId?: string;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CategoryInput {
  name: string;
  description?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  description?: string;
}

export interface WarehouseInput {
  name: string;
  location: string;
  description?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  product?: Product;
  warehouse?: Warehouse;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  warehouseId: string;
  type: string;
  quantity: number;
  note?: string;
  createdAt: string;
  product?: Product;
  warehouse?: Warehouse;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SupplierInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SalesOrder {
  id: string;
  customerId?: string;
  customer?: Customer;
  status: string;
  total: number;
  items?: SalesOrderItem[];
  createdAt: string;
}

export interface SalesOrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface SalesOrderInput {
  customerId?: string;
  items: { productId: string; quantity: number; price: number }[];
}

export interface PurchaseOrder {
  id: string;
  supplierId?: string;
  supplier?: Supplier;
  warehouseId?: string;
  warehouse?: Warehouse;
  status: string;
  total: number;
  items?: PurchaseOrderItem[];
  createdAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  cost: number;
}

export interface PurchaseOrderInput {
  supplierId?: string;
  warehouseId?: string;
  items: { productId: string; quantity: number; cost: number }[];
}

export interface Invoice {
  id: string;
  customerId?: string;
  customer?: Customer;
  salesOrderId?: string;
  status: string;
  total: number;
  dueDate?: string;
  createdAt: string;
}

export interface InvoiceInput {
  customerId?: string;
  salesOrderId?: string;
  dueDate?: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface MessageResponse {
  message: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface ResendOtpInput {
  email: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

// ─── Query key factories ───────────────────────────────────────────────────────

export const getListProductsQueryKey = () => ["products"];
export const getListCategoriesQueryKey = () => ["categories"];
export const getListWarehousesQueryKey = () => ["warehouses"];
export const getListInventoryQueryKey = () => ["inventory"];
export const getListInventoryTransactionsQueryKey = () => ["inventory-transactions"];
export const getListCustomersQueryKey = () => ["customers"];
export const getListSuppliersQueryKey = () => ["suppliers"];
export const getListSalesOrdersQueryKey = () => ["sales-orders"];
export const getListPurchaseOrdersQueryKey = () => ["purchase-orders"];
export const getListInvoicesQueryKey = () => ["invoices"];
export const getListNotificationsQueryKey = () => ["notifications"];
export const getGetAiConversationsQueryKey = () => ["ai-conversations"];

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function useGetMe(options?: { query?: { enabled?: boolean; retry?: boolean } }) {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: () => apiFetch<User>("/api/auth/me"),
    enabled: options?.query?.enabled ?? true,
    retry: options?.query?.retry ?? 1,
  });
}

export function useLogin(options?: { mutation?: { onSuccess?: (data: AuthResponse) => void; onError?: (err: unknown) => void } }) {
  return useMutation<AuthResponse, ApiError, { loginInput: LoginInput }>({
    mutationFn: ({ loginInput }) =>
      apiFetch<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(loginInput) }),
    onSuccess: options?.mutation?.onSuccess,
    onError: options?.mutation?.onError,
  });
}

export function useRegister(options?: { mutation?: { onSuccess?: (data: RegisterResponse) => void; onError?: (err: unknown) => void } }) {
  return useMutation<RegisterResponse, ApiError, { registerInput: RegisterInput }>({
    mutationFn: ({ registerInput }) =>
      apiFetch<RegisterResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(registerInput) }),
    onSuccess: options?.mutation?.onSuccess,
    onError: options?.mutation?.onError,
  });
}

export function useVerifyOtp(options?: { mutation?: { onSuccess?: (data: AuthResponse) => void; onError?: (err: unknown) => void } }) {
  return useMutation<AuthResponse, ApiError, VerifyOtpInput>({
    mutationFn: (input) =>
      apiFetch<AuthResponse>("/api/auth/verify-otp", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: options?.mutation?.onSuccess,
    onError: options?.mutation?.onError,
  });
}

export function useResendOtp(options?: { mutation?: { onSuccess?: (data: MessageResponse) => void; onError?: (err: unknown) => void } }) {
  return useMutation<MessageResponse, ApiError, ResendOtpInput>({
    mutationFn: (input) =>
      apiFetch<MessageResponse>("/api/auth/resend-otp", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: options?.mutation?.onSuccess,
    onError: options?.mutation?.onError,
  });
}

export function useForgotPassword(options?: { mutation?: { onSuccess?: (data: MessageResponse) => void; onError?: (err: unknown) => void } }) {
  return useMutation<MessageResponse, ApiError, ForgotPasswordInput>({
    mutationFn: (input) =>
      apiFetch<MessageResponse>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: options?.mutation?.onSuccess,
    onError: options?.mutation?.onError,
  });
}

export function useResetPassword(options?: { mutation?: { onSuccess?: (data: MessageResponse) => void; onError?: (err: unknown) => void } }) {
  return useMutation<MessageResponse, ApiError, ResetPasswordInput>({
    mutationFn: (input) =>
      apiFetch<MessageResponse>("/api/auth/reset-password", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: options?.mutation?.onSuccess,
    onError: options?.mutation?.onError,
  });
}

export function useVerifyEmailToken(options?: { mutation?: { onSuccess?: (data: AuthResponse) => void; onError?: (err: unknown) => void } }) {
  return useMutation<AuthResponse, ApiError, { token: string }>({
    mutationFn: ({ token }) => apiFetch<AuthResponse>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),
    onSuccess: options?.mutation?.onSuccess,
    onError: options?.mutation?.onError,
  });
}

export function useLogout() {
  return useMutation<void, Error, void>({
    mutationFn: () => apiFetch<void>("/api/auth/logout", { method: "POST" }),
  });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function useListProducts(options?: { query?: { enabled?: boolean } }) {
  return useQuery<Product[]>({
    queryKey: getListProductsQueryKey(),
    queryFn: () => apiFetch<Product[]>("/api/products"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation<Product, Error, { productInput: ProductInput }>({
    mutationFn: ({ productInput }) =>
      apiFetch<Product>("/api/products", { method: "POST", body: JSON.stringify(productInput) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListProductsQueryKey() }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation<Product, Error, { id: string; productUpdate: Partial<ProductInput> }>({
    mutationFn: ({ id, productUpdate }) =>
      apiFetch<Product>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(productUpdate) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListProductsQueryKey() }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListProductsQueryKey() }),
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useListCategories(options?: { query?: { enabled?: boolean } }) {
  return useQuery<Category[]>({
    queryKey: getListCategoriesQueryKey(),
    queryFn: () => apiFetch<Category[]>("/api/categories"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation<Category, Error, { categoryInput: CategoryInput }>({
    mutationFn: ({ categoryInput }) =>
      apiFetch<Category>("/api/categories", { method: "POST", body: JSON.stringify(categoryInput) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation<Category, Error, { id: string; categoryUpdate: Partial<CategoryInput> }>({
    mutationFn: ({ id, categoryUpdate }) =>
      apiFetch<Category>(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(categoryUpdate) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() }),
  });
}

// ─── Warehouses ───────────────────────────────────────────────────────────────

export function useListWarehouses(options?: { query?: { enabled?: boolean } }) {
  return useQuery<Warehouse[]>({
    queryKey: getListWarehousesQueryKey(),
    queryFn: () => apiFetch<Warehouse[]>("/api/warehouses"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useMutation<Warehouse, Error, { warehouseInput: WarehouseInput }>({
    mutationFn: ({ warehouseInput }) =>
      apiFetch<Warehouse>("/api/warehouses", { method: "POST", body: JSON.stringify(warehouseInput) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListWarehousesQueryKey() }),
  });
}

export function useUpdateWarehouse() {
  const qc = useQueryClient();
  return useMutation<Warehouse, Error, { id: string; warehouseUpdate: Partial<WarehouseInput> }>({
    mutationFn: ({ id, warehouseUpdate }) =>
      apiFetch<Warehouse>(`/api/warehouses/${id}`, { method: "PUT", body: JSON.stringify(warehouseUpdate) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListWarehousesQueryKey() }),
  });
}

export function useDeleteWarehouse() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/warehouses/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListWarehousesQueryKey() }),
  });
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export function useListInventory(options?: { query?: { enabled?: boolean } }) {
  return useQuery<InventoryItem[]>({
    queryKey: getListInventoryQueryKey(),
    queryFn: () => apiFetch<InventoryItem[]>("/api/inventory"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useListInventoryTransactions(options?: { query?: { enabled?: boolean } }) {
  return useQuery<InventoryTransaction[]>({
    queryKey: getListInventoryTransactionsQueryKey(),
    queryFn: () => apiFetch<InventoryTransaction[]>("/api/inventory/transactions"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useAdjustInventory() {
  const qc = useQueryClient();
  return useMutation<void, Error, { productId: string; warehouseId: string; quantity: number; note?: string }>({
    mutationFn: (data) =>
      apiFetch<void>("/api/inventory/adjust", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListInventoryQueryKey() }),
  });
}

export function useTransferInventory() {
  const qc = useQueryClient();
  return useMutation<void, Error, { productId: string; fromWarehouseId: string; toWarehouseId: string; quantity: number }>({
    mutationFn: (data) =>
      apiFetch<void>("/api/inventory/transfer", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListInventoryQueryKey() }),
  });
}

// ─── Customers ────────────────────────────────────────────────────────────────

export function useListCustomers(options?: { query?: { enabled?: boolean } }) {
  return useQuery<Customer[]>({
    queryKey: getListCustomersQueryKey(),
    queryFn: () => apiFetch<Customer[]>("/api/customers"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation<Customer, Error, { customerInput: CustomerInput }>({
    mutationFn: ({ customerInput }) =>
      apiFetch<Customer>("/api/customers", { method: "POST", body: JSON.stringify(customerInput) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListCustomersQueryKey() }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation<Customer, Error, { id: string; customerUpdate: Partial<CustomerInput> }>({
    mutationFn: ({ id, customerUpdate }) =>
      apiFetch<Customer>(`/api/customers/${id}`, { method: "PUT", body: JSON.stringify(customerUpdate) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListCustomersQueryKey() }),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/customers/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListCustomersQueryKey() }),
  });
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export function useListSuppliers(options?: { query?: { enabled?: boolean } }) {
  return useQuery<Supplier[]>({
    queryKey: getListSuppliersQueryKey(),
    queryFn: () => apiFetch<Supplier[]>("/api/suppliers"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation<Supplier, Error, { supplierInput: SupplierInput }>({
    mutationFn: ({ supplierInput }) =>
      apiFetch<Supplier>("/api/suppliers", { method: "POST", body: JSON.stringify(supplierInput) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListSuppliersQueryKey() }),
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation<Supplier, Error, { id: string; supplierUpdate: Partial<SupplierInput> }>({
    mutationFn: ({ id, supplierUpdate }) =>
      apiFetch<Supplier>(`/api/suppliers/${id}`, { method: "PUT", body: JSON.stringify(supplierUpdate) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListSuppliersQueryKey() }),
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/suppliers/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListSuppliersQueryKey() }),
  });
}

// ─── Sales Orders ─────────────────────────────────────────────────────────────

export function useListSalesOrders(options?: { query?: { enabled?: boolean } }) {
  return useQuery<SalesOrder[]>({
    queryKey: getListSalesOrdersQueryKey(),
    queryFn: () => apiFetch<SalesOrder[]>("/api/sales"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useGetSalesSummary(options?: { query?: { enabled?: boolean } }) {
  return useQuery({
    queryKey: ["sales-summary"],
    queryFn: () => apiFetch("/api/sales/summary"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateSalesOrder() {
  const qc = useQueryClient();
  return useMutation<SalesOrder, Error, { salesOrderInput: SalesOrderInput }>({
    mutationFn: ({ salesOrderInput }) =>
      apiFetch<SalesOrder>("/api/sales", { method: "POST", body: JSON.stringify(salesOrderInput) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() }),
  });
}

export function useUpdateSalesOrder() {
  const qc = useQueryClient();
  return useMutation<SalesOrder, Error, { id: string; salesOrderUpdate: Partial<SalesOrderInput> & { status?: string } }>({
    mutationFn: ({ id, salesOrderUpdate }) =>
      apiFetch<SalesOrder>(`/api/sales/${id}`, { method: "PUT", body: JSON.stringify(salesOrderUpdate) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() }),
  });
}

export function useDeleteSalesOrder() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/sales/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() }),
  });
}

// ─── Purchase Orders ──────────────────────────────────────────────────────────

export function useListPurchaseOrders(options?: { query?: { enabled?: boolean } }) {
  return useQuery<PurchaseOrder[]>({
    queryKey: getListPurchaseOrdersQueryKey(),
    queryFn: () => apiFetch<PurchaseOrder[]>("/api/purchases"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation<PurchaseOrder, Error, { purchaseOrderInput: PurchaseOrderInput }>({
    mutationFn: ({ purchaseOrderInput }) =>
      apiFetch<PurchaseOrder>("/api/purchases", { method: "POST", body: JSON.stringify(purchaseOrderInput) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() }),
  });
}

export function useUpdatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation<PurchaseOrder, Error, { id: string; purchaseOrderUpdate: Partial<PurchaseOrderInput> & { status?: string } }>({
    mutationFn: ({ id, purchaseOrderUpdate }) =>
      apiFetch<PurchaseOrder>(`/api/purchases/${id}`, { method: "PUT", body: JSON.stringify(purchaseOrderUpdate) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() }),
  });
}

export function useDeletePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/purchases/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() }),
  });
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export function useListInvoices(options?: { query?: { enabled?: boolean } }) {
  return useQuery<Invoice[]>({
    queryKey: getListInvoicesQueryKey(),
    queryFn: () => apiFetch<Invoice[]>("/api/invoices"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation<Invoice, Error, { invoiceInput: InvoiceInput }>({
    mutationFn: ({ invoiceInput }) =>
      apiFetch<Invoice>("/api/invoices", { method: "POST", body: JSON.stringify(invoiceInput) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListInvoicesQueryKey() }),
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();
  return useMutation<Invoice, Error, { id: string; invoiceUpdate: Partial<InvoiceInput> & { status?: string } }>({
    mutationFn: ({ id, invoiceUpdate }) =>
      apiFetch<Invoice>(`/api/invoices/${id}`, { method: "PUT", body: JSON.stringify(invoiceUpdate) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListInvoicesQueryKey() }),
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function useListNotifications(options?: { query?: { enabled?: boolean } }) {
  return useQuery<Notification[]>({
    queryKey: getListNotificationsQueryKey(),
    queryFn: () => apiFetch<Notification[]>("/api/notifications"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/notifications/${id}/read`, { method: "PUT" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => apiFetch<void>("/api/notifications/read-all", { method: "PUT" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
  });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useGetDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => apiFetch("/api/dashboard/summary"),
  });
}

export function useGetRevenueChart() {
  return useQuery({
    queryKey: ["revenue-chart"],
    queryFn: () => apiFetch("/api/dashboard/revenue-chart"),
  });
}

export function useGetTopProducts() {
  return useQuery({
    queryKey: ["top-products"],
    queryFn: () => apiFetch("/api/dashboard/top-products"),
  });
}

export function useGetRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => apiFetch("/api/dashboard/recent-activity"),
  });
}

export function useGetLowStockAlerts() {
  return useQuery({
    queryKey: ["low-stock-alerts"],
    queryFn: () => apiFetch("/api/dashboard/low-stock"),
  });
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export function useGetInventoryReport() {
  return useQuery({
    queryKey: ["report-inventory"],
    queryFn: () => apiFetch("/api/reports/inventory"),
  });
}

export function useGetSalesReport() {
  return useQuery({
    queryKey: ["report-sales"],
    queryFn: () => apiFetch("/api/reports/sales"),
  });
}

export function useGetProfitLossReport() {
  return useQuery({
    queryKey: ["report-profit-loss"],
    queryFn: () => apiFetch("/api/reports/profit-loss"),
  });
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export function useGetAiInsights() {
  return useQuery({
    queryKey: ["ai-insights"],
    queryFn: () => apiFetch("/api/ai/insights"),
  });
}

export function useGetAiConversations() {
  return useQuery({
    queryKey: getGetAiConversationsQueryKey(),
    queryFn: () => apiFetch("/api/ai/conversations"),
  });
}

export function usePostAiChat(options?: { mutation?: { onSuccess?: (data: { message: string; reply: string; role: string; conversationId?: string }) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<{ message: string; reply: string; role: string; conversationId?: string }, Error, { message: string; conversationId?: string }>({
    mutationFn: (data) => {
      const body: { message: string; conversationId?: number } = { message: data.message };
      if (data.conversationId !== undefined) body.conversationId = data.conversationId;
      return apiFetch<{ message: string; reply: string; role: string; conversationId?: string }>("/api/ai/chat", { method: "POST", body: JSON.stringify(body) });
    },
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getGetAiConversationsQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}