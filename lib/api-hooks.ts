/**
 * api-hooks.ts
 * Thin fetch + TanStack Query hooks over the Nexus backend REST API.
 *
 * IMPORTANT: these types and request shapes are written to match what the
 * backend (src/routes/*.ts) actually sends/expects. If you change a field
 * name on one side, change it here too - there is no runtime validation
 * layer between them.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  costPrice: number;
  status: string;
  categoryId?: number | null;
  categoryName?: string | null;
  imageUrl?: string | null;
  reorderPoint: number;
  totalStock: number;
  createdAt: string;
}

export interface ProductInput {
  name: string;
  sku: string;
  description?: string;
  price?: number;
  costPrice?: number;
  status?: string;
  categoryId?: number | null;
  imageUrl?: string;
  reorderPoint?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  color?: string | null;
  productCount: number;
  createdAt: string;
}

export interface CategoryInput {
  name: string;
  description?: string;
  color?: string;
}

export interface Warehouse {
  id: number;
  name: string;
  location?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface WarehouseInput {
  name: string;
  location?: string;
  isActive?: boolean;
}

export interface InventoryItem {
  id: number;
  productId: number;
  warehouseId: number;
  quantity: number;
  productName: string;
  productSku: string;
  reorderPoint: number;
  warehouseName: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: number;
  productId: number;
  warehouseId: number;
  type: string;
  quantity: number;
  reason: string;
  notes?: string | null;
  productName: string;
  warehouseName: string;
  performedBy?: string | null;
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  notes?: string | null;
  orderCount: number;
  createdAt: string;
}

export interface CustomerInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
}

export interface Supplier {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  contactPerson?: string | null;
  notes?: string | null;
  orderCount: number;
  createdAt: string;
}

export interface SupplierInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  notes?: string;
}

export interface SalesOrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface SalesOrder {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName?: string | null;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string | null;
  items: SalesOrderItem[];
  createdAt: string;
}

export interface SalesOrderInput {
  customerId: number;
  items: { productId: number; quantity: number; unitPrice: number; discount?: number }[];
  discount?: number;
  tax?: number;
  notes?: string;
}

export interface PurchaseOrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplierId: number;
  supplierName?: string | null;
  warehouseId?: number | null;
  warehouseName?: string | null;
  status: string;
  total: number;
  notes?: string | null;
  expectedDate?: string | null;
  items: PurchaseOrderItem[];
  createdAt: string;
}

export interface PurchaseOrderInput {
  supplierId: number;
  warehouseId?: number;
  items: { productId: number; quantity: number; unitCost: number }[];
  notes?: string;
  expectedDate?: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerId: number;
  customerName?: string | null;
  salesOrderId?: number | null;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  paidAt?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface InvoiceInput {
  customerId: number;
  salesOrderId?: number;
  subtotal?: number;
  tax?: number;
  total?: number;
  dueDate: string;
  notes?: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  isRead: boolean;
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

// Small helper so every list hook builds its querystring the same way
// instead of each one hand-rolling (and some of them forgetting to) it.
function toQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      usp.set(key, String(value));
    }
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

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
  return useMutation<void, ApiError, void>({
    mutationFn: () => apiFetch<void>("/api/auth/logout", { method: "POST" }),
  });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function useListProducts(params?: { search?: string; categoryId?: number; status?: string }, options?: { query?: { enabled?: boolean } }) {
  return useQuery<Product[]>({
    queryKey: [...getListProductsQueryKey(), params],
    queryFn: () => apiFetch<Product[]>(`/api/products${toQueryString(params)}`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateProduct(options?: { mutation?: { onSuccess?: (data: Product) => void } }) {
  const qc = useQueryClient();
  return useMutation<Product, ApiError, { productInput: ProductInput }>({
    mutationFn: ({ productInput }) =>
      apiFetch<Product>("/api/products", { method: "POST", body: JSON.stringify(productInput) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListProductsQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useUpdateProduct(options?: { mutation?: { onSuccess?: (data: Product) => void } }) {
  const qc = useQueryClient();
  return useMutation<Product, ApiError, { id: number; productUpdate: Partial<ProductInput> }>({
    mutationFn: ({ id, productUpdate }) =>
      // The backend only implements PATCH for updates, not PUT.
      apiFetch<Product>(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(productUpdate) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListProductsQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useDeleteProduct(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { id: number }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListProductsQueryKey() });
      options?.mutation?.onSuccess?.();
    },
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

export function useCreateCategory(options?: { mutation?: { onSuccess?: (data: Category) => void } }) {
  const qc = useQueryClient();
  return useMutation<Category, ApiError, { categoryInput: CategoryInput }>({
    mutationFn: ({ categoryInput }) =>
      apiFetch<Category>("/api/categories", { method: "POST", body: JSON.stringify(categoryInput) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useUpdateCategory(options?: { mutation?: { onSuccess?: (data: Category) => void } }) {
  const qc = useQueryClient();
  return useMutation<Category, ApiError, { id: number; categoryUpdate: Partial<CategoryInput> }>({
    mutationFn: ({ id, categoryUpdate }) =>
      apiFetch<Category>(`/api/categories/${id}`, { method: "PATCH", body: JSON.stringify(categoryUpdate) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useDeleteCategory(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { id: number }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
      options?.mutation?.onSuccess?.();
    },
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

export function useCreateWarehouse(options?: { mutation?: { onSuccess?: (data: Warehouse) => void } }) {
  const qc = useQueryClient();
  return useMutation<Warehouse, ApiError, { warehouseInput: WarehouseInput }>({
    mutationFn: ({ warehouseInput }) =>
      apiFetch<Warehouse>("/api/warehouses", { method: "POST", body: JSON.stringify(warehouseInput) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListWarehousesQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useUpdateWarehouse(options?: { mutation?: { onSuccess?: (data: Warehouse) => void } }) {
  const qc = useQueryClient();
  return useMutation<Warehouse, ApiError, { id: number; warehouseUpdate: Partial<WarehouseInput> }>({
    mutationFn: ({ id, warehouseUpdate }) =>
      apiFetch<Warehouse>(`/api/warehouses/${id}`, { method: "PATCH", body: JSON.stringify(warehouseUpdate) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListWarehousesQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useDeleteWarehouse(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { id: number }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/warehouses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListWarehousesQueryKey() });
      options?.mutation?.onSuccess?.();
    },
  });
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export function useListInventory(params?: { warehouseId?: number; productId?: number }, options?: { query?: { enabled?: boolean } }) {
  return useQuery<InventoryItem[]>({
    queryKey: [...getListInventoryQueryKey(), params],
    // NOTE: the backend doesn't support a free-text `search` param on
    // /api/inventory (only warehouseId/productId). Pages should filter
    // client-side against productName/productSku for a search box.
    queryFn: () => apiFetch<InventoryItem[]>(`/api/inventory${toQueryString(params)}`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useListInventoryTransactions(params?: { productId?: number; warehouseId?: number; limit?: number }, options?: { query?: { enabled?: boolean } }) {
  return useQuery<InventoryTransaction[]>({
    queryKey: [...getListInventoryTransactionsQueryKey(), params],
    queryFn: () => apiFetch<InventoryTransaction[]>(`/api/inventory/transactions${toQueryString(params)}`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useAdjustInventory(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { productId: number; warehouseId: number; quantity: number; reason: string }>({
    // Send the fields directly - the backend reads req.body.productId etc,
    // not a wrapped { inventoryAdjustment: {...} } object.
    mutationFn: (data) => apiFetch<void>("/api/inventory/adjust", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListInventoryQueryKey() });
      qc.invalidateQueries({ queryKey: getListInventoryTransactionsQueryKey() });
      options?.mutation?.onSuccess?.();
    },
  });
}

export function useTransferInventory(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { productId: number; fromWarehouseId: number; toWarehouseId: number; quantity: number; notes?: string }>({
    mutationFn: (data) => apiFetch<void>("/api/inventory/transfer", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListInventoryQueryKey() });
      qc.invalidateQueries({ queryKey: getListInventoryTransactionsQueryKey() });
      options?.mutation?.onSuccess?.();
    },
  });
}

// ─── Customers ────────────────────────────────────────────────────────────────

export function useListCustomers(params?: { search?: string }, options?: { query?: { enabled?: boolean } }) {
  return useQuery<Customer[]>({
    queryKey: [...getListCustomersQueryKey(), params],
    queryFn: () => apiFetch<Customer[]>(`/api/customers${toQueryString(params)}`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateCustomer(options?: { mutation?: { onSuccess?: (data: Customer) => void } }) {
  const qc = useQueryClient();
  return useMutation<Customer, ApiError, { customerInput: CustomerInput }>({
    mutationFn: ({ customerInput }) =>
      apiFetch<Customer>("/api/customers", { method: "POST", body: JSON.stringify(customerInput) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListCustomersQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useUpdateCustomer(options?: { mutation?: { onSuccess?: (data: Customer) => void } }) {
  const qc = useQueryClient();
  return useMutation<Customer, ApiError, { id: number; customerUpdate: Partial<CustomerInput> }>({
    mutationFn: ({ id, customerUpdate }) =>
      apiFetch<Customer>(`/api/customers/${id}`, { method: "PATCH", body: JSON.stringify(customerUpdate) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListCustomersQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useDeleteCustomer(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { id: number }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/customers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListCustomersQueryKey() });
      options?.mutation?.onSuccess?.();
    },
  });
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export function useListSuppliers(params?: { search?: string }, options?: { query?: { enabled?: boolean } }) {
  return useQuery<Supplier[]>({
    queryKey: [...getListSuppliersQueryKey(), params],
    queryFn: () => apiFetch<Supplier[]>(`/api/suppliers${toQueryString(params)}`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateSupplier(options?: { mutation?: { onSuccess?: (data: Supplier) => void } }) {
  const qc = useQueryClient();
  return useMutation<Supplier, ApiError, { supplierInput: SupplierInput }>({
    mutationFn: ({ supplierInput }) =>
      apiFetch<Supplier>("/api/suppliers", { method: "POST", body: JSON.stringify(supplierInput) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListSuppliersQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useUpdateSupplier(options?: { mutation?: { onSuccess?: (data: Supplier) => void } }) {
  const qc = useQueryClient();
  return useMutation<Supplier, ApiError, { id: number; supplierUpdate: Partial<SupplierInput> }>({
    mutationFn: ({ id, supplierUpdate }) =>
      apiFetch<Supplier>(`/api/suppliers/${id}`, { method: "PATCH", body: JSON.stringify(supplierUpdate) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListSuppliersQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useDeleteSupplier(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { id: number }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/suppliers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListSuppliersQueryKey() });
      options?.mutation?.onSuccess?.();
    },
  });
}

// ─── Sales Orders ─────────────────────────────────────────────────────────────

export function useListSalesOrders(params?: { search?: string; status?: string; customerId?: number }, options?: { query?: { enabled?: boolean } }) {
  return useQuery<SalesOrder[]>({
    queryKey: [...getListSalesOrdersQueryKey(), params],
    // NOTE: the backend doesn't support a free-text `search` param on
    // /api/sales (only status/customerId) - `search` is ignored server-side.
    queryFn: () => apiFetch<SalesOrder[]>(`/api/sales${toQueryString({ status: params?.status, customerId: params?.customerId })}`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useGetSalesSummary(options?: { query?: { enabled?: boolean } }) {
  return useQuery({
    queryKey: ["sales-summary"],
    // Was pointed at /api/sales/summary (404) - the real route is
    // /api/sales/summary/stats.
    queryFn: () => apiFetch<{
      totalRevenue: number;
      totalOrders: number;
      averageOrderValue: number;
      pendingOrders: number;
      completedOrders: number;
      cancelledOrders: number;
    }>("/api/sales/summary/stats"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateSalesOrder(options?: { mutation?: { onSuccess?: (data: SalesOrder) => void } }) {
  const qc = useQueryClient();
  return useMutation<SalesOrder, ApiError, { salesOrderInput: SalesOrderInput }>({
    mutationFn: ({ salesOrderInput }) =>
      apiFetch<SalesOrder>("/api/sales", { method: "POST", body: JSON.stringify(salesOrderInput) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useUpdateSalesOrder(options?: { mutation?: { onSuccess?: (data: SalesOrder) => void } }) {
  const qc = useQueryClient();
  return useMutation<SalesOrder, ApiError, { id: number; salesOrderUpdate: Partial<SalesOrderInput> & { status?: string } }>({
    mutationFn: ({ id, salesOrderUpdate }) =>
      apiFetch<SalesOrder>(`/api/sales/${id}`, { method: "PATCH", body: JSON.stringify(salesOrderUpdate) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
      qc.invalidateQueries({ queryKey: getListInventoryQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useDeleteSalesOrder(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { id: number }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/sales/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
      options?.mutation?.onSuccess?.();
    },
  });
}

// ─── Purchase Orders ──────────────────────────────────────────────────────────

export function useListPurchaseOrders(params?: { search?: string; status?: string; supplierId?: number }, options?: { query?: { enabled?: boolean } }) {
  return useQuery<PurchaseOrder[]>({
    queryKey: [...getListPurchaseOrdersQueryKey(), params],
    queryFn: () => apiFetch<PurchaseOrder[]>(`/api/purchases${toQueryString({ status: params?.status, supplierId: params?.supplierId })}`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreatePurchaseOrder(options?: { mutation?: { onSuccess?: (data: PurchaseOrder) => void } }) {
  const qc = useQueryClient();
  return useMutation<PurchaseOrder, ApiError, { purchaseOrderInput: PurchaseOrderInput }>({
    mutationFn: ({ purchaseOrderInput }) =>
      apiFetch<PurchaseOrder>("/api/purchases", { method: "POST", body: JSON.stringify(purchaseOrderInput) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useUpdatePurchaseOrder(options?: { mutation?: { onSuccess?: (data: PurchaseOrder) => void } }) {
  const qc = useQueryClient();
  return useMutation<PurchaseOrder, ApiError, { id: number; purchaseOrderUpdate: Partial<PurchaseOrderInput> & { status?: string } }>({
    mutationFn: ({ id, purchaseOrderUpdate }) =>
      apiFetch<PurchaseOrder>(`/api/purchases/${id}`, { method: "PATCH", body: JSON.stringify(purchaseOrderUpdate) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() });
      qc.invalidateQueries({ queryKey: getListInventoryQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useDeletePurchaseOrder(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { id: number }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/purchases/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() });
      options?.mutation?.onSuccess?.();
    },
  });
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export function useListInvoices(params?: { search?: string; status?: string; customerId?: number }, options?: { query?: { enabled?: boolean } }) {
  return useQuery<Invoice[]>({
    queryKey: [...getListInvoicesQueryKey(), params],
    queryFn: () => apiFetch<Invoice[]>(`/api/invoices${toQueryString({ status: params?.status, customerId: params?.customerId })}`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateInvoice(options?: { mutation?: { onSuccess?: (data: Invoice) => void } }) {
  const qc = useQueryClient();
  return useMutation<Invoice, ApiError, { invoiceInput: InvoiceInput }>({
    mutationFn: ({ invoiceInput }) =>
      apiFetch<Invoice>("/api/invoices", { method: "POST", body: JSON.stringify(invoiceInput) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListInvoicesQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

export function useUpdateInvoice(options?: { mutation?: { onSuccess?: (data: Invoice) => void } }) {
  const qc = useQueryClient();
  return useMutation<Invoice, ApiError, { id: number; invoiceUpdate: Partial<InvoiceInput> & { status?: string } }>({
    mutationFn: ({ id, invoiceUpdate }) =>
      apiFetch<Invoice>(`/api/invoices/${id}`, { method: "PATCH", body: JSON.stringify(invoiceUpdate) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: getListInvoicesQueryKey() });
      options?.mutation?.onSuccess?.(data);
    },
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function useListNotifications(params?: { unread?: boolean }, options?: { query?: { enabled?: boolean } }) {
  return useQuery<Notification[]>({
    queryKey: [...getListNotificationsQueryKey(), params],
    queryFn: () => apiFetch<Notification[]>(`/api/notifications${toQueryString(params)}`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useMarkNotificationRead(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { id: number }>({
    // Backend route is PATCH /api/notifications/:id/read (was PUT).
    mutationFn: ({ id }) => apiFetch<void>(`/api/notifications/${id}/read`, { method: "PATCH" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      options?.mutation?.onSuccess?.();
    },
  });
}

export function useMarkAllNotificationsRead(options?: { mutation?: { onSuccess?: () => void } }) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, void>({
    // Backend route is POST /api/notifications/mark-all-read
    // (was PUT /api/notifications/read-all - wrong method AND wrong path).
    mutationFn: () => apiFetch<void>("/api/notifications/mark-all-read", { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      options?.mutation?.onSuccess?.();
    },
  });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  lowStockCount: number;
  pendingOrders: number;
}

export function useGetDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    queryFn: () => apiFetch<DashboardSummary>("/api/dashboard/summary"),
  });
}

export function useGetRevenueChart() {
  return useQuery<{ label: string; value: number }[]>({
    queryKey: ["revenue-chart"],
    queryFn: () => apiFetch<{ label: string; value: number }[]>("/api/dashboard/revenue-chart"),
  });
}

export interface TopProduct {
  id: number;
  name: string;
  sku: string;
  imageUrl?: string | null;
  revenue: number;
  unitsSold: number;
  stock: number;
}

export function useGetTopProducts() {
  return useQuery<TopProduct[]>({
    queryKey: ["top-products"],
    queryFn: () => apiFetch<TopProduct[]>("/api/dashboard/top-products"),
  });
}

export interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

export function useGetRecentActivity() {
  return useQuery<RecentActivity[]>({
    queryKey: ["recent-activity"],
    queryFn: () => apiFetch<RecentActivity[]>("/api/dashboard/recent-activity"),
  });
}

export interface LowStockAlert {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  warehouseName: string;
}

export function useGetLowStockAlerts() {
  return useQuery<LowStockAlert[]>({
    queryKey: ["low-stock-alerts"],
    queryFn: () => apiFetch<LowStockAlert[]>("/api/dashboard/low-stock"),
  });
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface InventoryReport {
  totalProducts: number;
  totalStock: number;
  stockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: { categoryName: string; productCount: number; totalStock: number; stockValue: number }[];
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topCustomers: { customerId: number; customerName: string; totalOrders: number; totalSpent: number }[];
  monthlyBreakdown: { label: string; value: number }[];
}

export interface ProfitLossReport {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossMargin: number;
  monthlyData: { label: string; revenue: number; cost: number; profit: number }[];
}

export function useGetInventoryReport() {
  return useQuery<InventoryReport>({
    queryKey: ["report-inventory"],
    queryFn: () => apiFetch<InventoryReport>("/api/reports/inventory"),
  });
}

export function useGetSalesReport(params?: { period?: number }) {
  return useQuery<SalesReport>({
    queryKey: ["report-sales", params],
    // NOTE: the backend's /api/reports/sales endpoint always returns a
    // trailing-12-month breakdown regardless of `period` - it doesn't yet
    // support filtering by a custom window. The param is still sent (and
    // included in the cache key) so this is ready to wire up once the
    // backend adds that support.
    queryFn: () => apiFetch<SalesReport>(`/api/reports/sales${toQueryString(params)}`),
  });
}

export function useGetProfitLossReport(params?: { period?: number }) {
  return useQuery<ProfitLossReport>({
    queryKey: ["report-profit-loss", params],
    queryFn: () => apiFetch<ProfitLossReport>(`/api/reports/profit-loss${toQueryString(params)}`),
  });
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface AiInsight {
  id: number;
  type: string;
  title: string;
  priority: string;
  description: string;
}

export function useGetAiInsights() {
  return useQuery<AiInsight[]>({
    queryKey: ["ai-insights"],
    queryFn: () => apiFetch<AiInsight[]>("/api/ai/insights"),
  });
}

// NOTE: there is no /api/ai/conversations endpoint on the backend (no
// conversation persistence exists), so there's no corresponding hook here.
// The chat hook below is a single-turn request/response - the caller is
// responsible for keeping message history in local component state.

export function usePostAiChat(options?: { mutation?: { onSuccess?: (data: { message: string; reply: string; role: string }) => void; onError?: (err: Error) => void } }) {
  return useMutation<{ message: string; reply: string; role: string }, Error, { message: string }>({
    mutationFn: (data) =>
      apiFetch<{ message: string; reply: string; role: string }>("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: data.message }),
      }),
    onSuccess: options?.mutation?.onSuccess,
    onError: options?.mutation?.onError,
  });
}
