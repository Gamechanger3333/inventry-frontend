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

export interface AiInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
}

export interface AiConversation {
  id: string;
  title?: string;
  createdAt?: string;
}
export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice: number;
  categoryId?: number;
  categoryName?: string;
  category?: Category;
  status: string;
  reorderPoint?: number;
  stock?: number;
  imageUrl?: string;
  createdAt: string;
}

export interface ProductInput {
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice: number;
  categoryId?: number;
  status: string;
  reorderPoint?: number;
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
  capacity?: number;
}

export interface WarehouseInput {
  name: string;
  location: string;
  description?: string;
  capacity?: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  productName?: string;
  warehouseName?: string;
  reorderPoint?: number;
  product?: Product;
  warehouse?: Warehouse;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  warehouseId: string;
  type: string;
  quantity: number;
  reason?: string;
  productName?: string;
  warehouseName?: string;
  createdAt: string;
  product?: Product;
  warehouse?: Warehouse;
}

export interface InventoryAdjustment {
  productId: number;
  warehouseId: number;
  quantity: number;
  reason?: string;
}

export interface InventoryTransfer {
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  reason?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface CustomerInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  rating?: number;
}

export interface SupplierInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  rating?: number;
}

export interface SalesOrder {
  id: string;
  orderNumber?: string;
  customerId?: number;
  customerName?: string;
  customer?: Customer;
  status: string;
  total: number;
  discount?: number;
  notes?: string;
  items?: SalesOrderItem[];
  createdAt: string;
}

export interface SalesOrderItem {
  id?: string;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface SalesOrderInput {
  customerId?: number;
  items: { productId: number; quantity: number; unitPrice: number; discount?: number }[];
  discount?: number;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber?: string;
  supplierId?: number;
  supplierName?: string;
  supplier?: Supplier;
  warehouseId?: number;
  warehouseName?: string;
  warehouse?: Warehouse;
  status: string;
  total: number;
  notes?: string;
  items?: PurchaseOrderItem[];
  createdAt: string;
}

export interface PurchaseOrderItem {
  id?: string;
  productId: number;
  product?: Product;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrderInput {
  supplierId?: number;
  warehouseId?: number;
  items: { productId: number; quantity: number; unitCost: number }[];
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  customerId?: number;
  customerName?: string;
  customer?: Customer;
  salesOrderId?: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  dueDate?: string;
  createdAt: string;
}

export interface InvoiceInput {
  customerId?: number;
  salesOrderId?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
  notes?: string;
  dueDate?: string;
}

export interface Notification {
  id: string;
  title?: string;
  message: string;
  type: string;
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

export function useListProducts(params?: { search?: string; query?: { enabled?: boolean } }) {
  const qs = params?.search ? `?search=${encodeURIComponent(params.search)}` : "";
  return useQuery<Product[]>({
    queryKey: [...getListProductsQueryKey(), params?.search ?? null],
    queryFn: () => apiFetch<Product[]>(`/api/products${qs}`),
    enabled: params?.query?.enabled ?? true,
  });
}

export function useCreateProduct(options?: { mutation?: { onSuccess?: (data: Product) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Product, Error, { productInput: ProductInput }>({
    mutationFn: ({ productInput }) =>
      apiFetch<Product>("/api/products", { method: "POST", body: JSON.stringify(productInput) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListProductsQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useUpdateProduct(options?: { mutation?: { onSuccess?: (data: Product) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Product, Error, { id: string; productUpdate: Partial<ProductInput> }>({
    mutationFn: ({ id, productUpdate }) =>
      apiFetch<Product>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(productUpdate) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListProductsQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useDeleteProduct(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListProductsQueryKey() });
    },
    onError: options?.mutation?.onError,
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

export function useCreateCategory(options?: { mutation?: { onSuccess?: (data: Category) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Category, Error, { categoryInput: CategoryInput }>({
    mutationFn: ({ categoryInput }) =>
      apiFetch<Category>("/api/categories", { method: "POST", body: JSON.stringify(categoryInput) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useUpdateCategory(options?: { mutation?: { onSuccess?: (data: Category) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Category, Error, { id: string; categoryUpdate: Partial<CategoryInput> }>({
    mutationFn: ({ id, categoryUpdate }) =>
      apiFetch<Category>(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(categoryUpdate) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useDeleteCategory(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
    },
    onError: options?.mutation?.onError,
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

export function useCreateWarehouse(options?: { mutation?: { onSuccess?: (data: Warehouse) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Warehouse, Error, { warehouseInput: WarehouseInput }>({
    mutationFn: ({ warehouseInput }) =>
      apiFetch<Warehouse>("/api/warehouses", { method: "POST", body: JSON.stringify(warehouseInput) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListWarehousesQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useUpdateWarehouse(options?: { mutation?: { onSuccess?: (data: Warehouse) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Warehouse, Error, { id: string; warehouseUpdate: Partial<WarehouseInput> }>({
    mutationFn: ({ id, warehouseUpdate }) =>
      apiFetch<Warehouse>(`/api/warehouses/${id}`, { method: "PUT", body: JSON.stringify(warehouseUpdate) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListWarehousesQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useDeleteWarehouse(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/warehouses/${id}`, { method: "DELETE" }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListWarehousesQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export function useListInventory(params?: { search?: string; warehouseId?: string | number; query?: { enabled?: boolean } }) {
  const qp = new URLSearchParams();
  if (params?.search) qp.set("search", params.search);
  if (params?.warehouseId !== undefined) qp.set("warehouseId", String(params.warehouseId));
  const qs = qp.toString() ? `?${qp.toString()}` : "";
  return useQuery<InventoryItem[]>({
    queryKey: [...getListInventoryQueryKey(), params?.search ?? null, params?.warehouseId ?? null],
    queryFn: () => apiFetch<InventoryItem[]>(`/api/inventory${qs}`),
    enabled: params?.query?.enabled ?? true,
  });
}

export function useListInventoryTransactions(params?: { limit?: number; query?: { enabled?: boolean } }) {
  const qs = params?.limit !== undefined ? `?limit=${params.limit}` : "";
  return useQuery<InventoryTransaction[]>({
    queryKey: [...getListInventoryTransactionsQueryKey(), params?.limit ?? null],
    queryFn: () => apiFetch<InventoryTransaction[]>(`/api/inventory/transactions${qs}`),
    enabled: params?.query?.enabled ?? true,
  });
}

export function useAdjustInventory(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, { inventoryAdjustment: InventoryAdjustment }>({
    mutationFn: ({ inventoryAdjustment }) =>
      apiFetch<void>("/api/inventory/adjust", { method: "POST", body: JSON.stringify(inventoryAdjustment) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListInventoryQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useTransferInventory(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, { inventoryTransfer: InventoryTransfer }>({
    mutationFn: ({ inventoryTransfer }) =>
      apiFetch<void>("/api/inventory/transfer", { method: "POST", body: JSON.stringify(inventoryTransfer) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListInventoryQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

// ─── Customers ────────────────────────────────────────────────────────────────

export function useListCustomers(params?: { search?: string; query?: { enabled?: boolean } }) {
  const qs = params?.search ? `?search=${encodeURIComponent(params.search)}` : "";
  return useQuery<Customer[]>({
    queryKey: [...getListCustomersQueryKey(), params?.search ?? null],
    queryFn: () => apiFetch<Customer[]>(`/api/customers${qs}`),
    enabled: params?.query?.enabled ?? true,
  });
}

export function useCreateCustomer(options?: { mutation?: { onSuccess?: (data: Customer) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Customer, Error, { customerInput: CustomerInput }>({
    mutationFn: ({ customerInput }) =>
      apiFetch<Customer>("/api/customers", { method: "POST", body: JSON.stringify(customerInput) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListCustomersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useUpdateCustomer(options?: { mutation?: { onSuccess?: (data: Customer) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Customer, Error, { id: string; customerUpdate: Partial<CustomerInput> }>({
    mutationFn: ({ id, customerUpdate }) =>
      apiFetch<Customer>(`/api/customers/${id}`, { method: "PUT", body: JSON.stringify(customerUpdate) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListCustomersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useDeleteCustomer(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/customers/${id}`, { method: "DELETE" }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListCustomersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export function useListSuppliers(params?: { search?: string; query?: { enabled?: boolean } }) {
  const qs = params?.search ? `?search=${encodeURIComponent(params.search)}` : "";
  return useQuery<Supplier[]>({
    queryKey: [...getListSuppliersQueryKey(), params?.search ?? null],
    queryFn: () => apiFetch<Supplier[]>(`/api/suppliers${qs}`),
    enabled: params?.query?.enabled ?? true,
  });
}

export function useCreateSupplier(options?: { mutation?: { onSuccess?: (data: Supplier) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Supplier, Error, { supplierInput: SupplierInput }>({
    mutationFn: ({ supplierInput }) =>
      apiFetch<Supplier>("/api/suppliers", { method: "POST", body: JSON.stringify(supplierInput) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListSuppliersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useUpdateSupplier(options?: { mutation?: { onSuccess?: (data: Supplier) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Supplier, Error, { id: string; supplierUpdate: Partial<SupplierInput> }>({
    mutationFn: ({ id, supplierUpdate }) =>
      apiFetch<Supplier>(`/api/suppliers/${id}`, { method: "PUT", body: JSON.stringify(supplierUpdate) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListSuppliersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useDeleteSupplier(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/suppliers/${id}`, { method: "DELETE" }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListSuppliersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

// ─── Sales Orders ─────────────────────────────────────────────────────────────

export function useListSalesOrders(params?: { search?: string; status?: string; query?: { enabled?: boolean } }) {
  const qp = new URLSearchParams();
  if (params?.search) qp.set("search", params.search);
  if (params?.status) qp.set("status", params.status);
  const qs = qp.toString() ? `?${qp.toString()}` : "";
  return useQuery<SalesOrder[]>({
    queryKey: [...getListSalesOrdersQueryKey(), params?.search ?? null, params?.status ?? null],
    queryFn: () => apiFetch<SalesOrder[]>(`/api/sales${qs}`),
    enabled: params?.query?.enabled ?? true,
  });
}

export interface SalesSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export function useGetSalesSummary(options?: { query?: { enabled?: boolean } }) {
  return useQuery<SalesSummary>({
    queryKey: ["sales-summary"],
    queryFn: () => apiFetch<SalesSummary>("/api/sales/summary"),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateSalesOrder(options?: { mutation?: { onSuccess?: (data: SalesOrder) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<SalesOrder, Error, { salesOrderInput: SalesOrderInput }>({
    mutationFn: ({ salesOrderInput }) =>
      apiFetch<SalesOrder>("/api/sales", { method: "POST", body: JSON.stringify(salesOrderInput) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useUpdateSalesOrder(options?: { mutation?: { onSuccess?: (data: SalesOrder) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<SalesOrder, Error, { id: string; salesOrderUpdate: Partial<SalesOrderInput> & { status?: string } }>({
    mutationFn: ({ id, salesOrderUpdate }) =>
      apiFetch<SalesOrder>(`/api/sales/${id}`, { method: "PUT", body: JSON.stringify(salesOrderUpdate) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useDeleteSalesOrder(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/sales/${id}`, { method: "DELETE" }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

// ─── Purchase Orders ──────────────────────────────────────────────────────────

export function useListPurchaseOrders(params?: { search?: string; status?: string; query?: { enabled?: boolean } }) {
  const qp = new URLSearchParams();
  if (params?.search) qp.set("search", params.search);
  if (params?.status) qp.set("status", params.status);
  const qs = qp.toString() ? `?${qp.toString()}` : "";
  return useQuery<PurchaseOrder[]>({
    queryKey: [...getListPurchaseOrdersQueryKey(), params?.search ?? null, params?.status ?? null],
    queryFn: () => apiFetch<PurchaseOrder[]>(`/api/purchases${qs}`),
    enabled: params?.query?.enabled ?? true,
  });
}

export function useCreatePurchaseOrder(options?: { mutation?: { onSuccess?: (data: PurchaseOrder) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<PurchaseOrder, Error, { purchaseOrderInput: PurchaseOrderInput }>({
    mutationFn: ({ purchaseOrderInput }) =>
      apiFetch<PurchaseOrder>("/api/purchases", { method: "POST", body: JSON.stringify(purchaseOrderInput) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useUpdatePurchaseOrder(options?: { mutation?: { onSuccess?: (data: PurchaseOrder) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<PurchaseOrder, Error, { id: string; purchaseOrderUpdate: Partial<PurchaseOrderInput> & { status?: string } }>({
    mutationFn: ({ id, purchaseOrderUpdate }) =>
      apiFetch<PurchaseOrder>(`/api/purchases/${id}`, { method: "PUT", body: JSON.stringify(purchaseOrderUpdate) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useDeletePurchaseOrder(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/purchases/${id}`, { method: "DELETE" }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export function useListInvoices(params?: { search?: string; status?: string; query?: { enabled?: boolean } }) {
  const qp = new URLSearchParams();
  if (params?.search) qp.set("search", params.search);
  if (params?.status) qp.set("status", params.status);
  const qs = qp.toString() ? `?${qp.toString()}` : "";
  return useQuery<Invoice[]>({
    queryKey: [...getListInvoicesQueryKey(), params?.search ?? null, params?.status ?? null],
    queryFn: () => apiFetch<Invoice[]>(`/api/invoices${qs}`),
    enabled: params?.query?.enabled ?? true,
  });
}

export function useCreateInvoice(options?: { mutation?: { onSuccess?: (data: Invoice) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Invoice, Error, { invoiceInput: InvoiceInput }>({
    mutationFn: ({ invoiceInput }) =>
      apiFetch<Invoice>("/api/invoices", { method: "POST", body: JSON.stringify(invoiceInput) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListInvoicesQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useUpdateInvoice(options?: { mutation?: { onSuccess?: (data: Invoice) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<Invoice, Error, { id: string; invoiceUpdate: Partial<InvoiceInput> & { status?: string } }>({
    mutationFn: ({ id, invoiceUpdate }) =>
      apiFetch<Invoice>(`/api/invoices/${id}`, { method: "PUT", body: JSON.stringify(invoiceUpdate) }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListInvoicesQueryKey() });
    },
    onError: options?.mutation?.onError,
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

export function useMarkNotificationRead(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => apiFetch<void>(`/api/notifications/${id}/read`, { method: "PUT" }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

export function useMarkAllNotificationsRead(options?: { mutation?: { onSuccess?: (data: void) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => apiFetch<void>("/api/notifications/read-all", { method: "PUT" }),
    onSuccess: (data) => {
      options?.mutation?.onSuccess?.(data);
      qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    },
    onError: options?.mutation?.onError,
  });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  totalRevenue: number;
  revenueGrowth?: number;
  totalOrders: number;
  ordersGrowth?: number;
  totalProducts: number;
  totalCustomers: number;
}

export interface RevenueChartPoint {
  label: string;
  value: number;
}

export interface TopProduct {
  name: string;
  revenue: number;
}

export interface RecentActivityItem {
  description: string;
  timestamp: string;
}

export interface LowStockAlert {
  productName: string;
  warehouseName: string;
  quantity: number;
}

export function useGetDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    queryFn: () => apiFetch<DashboardSummary>("/api/dashboard/summary"),
  });
}

export function useGetRevenueChart() {
  return useQuery<RevenueChartPoint[]>({
    queryKey: ["revenue-chart"],
    queryFn: () => apiFetch<RevenueChartPoint[]>("/api/dashboard/revenue-chart"),
  });
}

export function useGetTopProducts() {
  return useQuery<TopProduct[]>({
    queryKey: ["top-products"],
    queryFn: () => apiFetch<TopProduct[]>("/api/dashboard/top-products"),
  });
}

export function useGetRecentActivity() {
  return useQuery<RecentActivityItem[]>({
    queryKey: ["recent-activity"],
    queryFn: () => apiFetch<RecentActivityItem[]>("/api/dashboard/recent-activity"),
  });
}

export function useGetLowStockAlerts() {
  return useQuery<LowStockAlert[]>({
    queryKey: ["low-stock-alerts"],
    queryFn: () => apiFetch<LowStockAlert[]>("/api/dashboard/low-stock"),
  });
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface InventoryReportCategory {
  categoryId: string;
  categoryName: string;
  totalValue: number;
  totalStock: number;
}

export interface InventoryReport {
  totalStockValue: number;
  totalItems: number;
  lowStockCount: number;
  byCategory: InventoryReportCategory[];
}

export interface SalesReportCustomer {
  customerName: string;
  totalSpent: number;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topCustomers: SalesReportCustomer[];
}

export interface ProfitLossMonthlyPoint {
  label: string;
  revenue: number;
  cogs: number;
  profit: number;
}

export interface ProfitLossReport {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossMargin: number;
  monthlyData: ProfitLossMonthlyPoint[];
}

export function useGetInventoryReport() {
  return useQuery<InventoryReport>({
    queryKey: ["report-inventory"],
    queryFn: () => apiFetch<InventoryReport>("/api/reports/inventory"),
  });
}

export function useGetSalesReport(params?: { period?: number }) {
  const qs = params?.period !== undefined ? `?period=${params.period}` : "";
  return useQuery<SalesReport>({
    queryKey: ["report-sales", params?.period ?? null],
    queryFn: () => apiFetch<SalesReport>(`/api/reports/sales${qs}`),
  });
}

export function useGetProfitLossReport(params?: { period?: number }) {
  const qs = params?.period !== undefined ? `?period=${params.period}` : "";
  return useQuery<ProfitLossReport>({
    queryKey: ["report-profit-loss", params?.period ?? null],
    queryFn: () => apiFetch<ProfitLossReport>(`/api/reports/profit-loss${qs}`),
  });
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export function useGetAiInsights() {
  return useQuery<AiInsight[]>({
    queryKey: ["ai-insights"],
    queryFn: () => apiFetch<AiInsight[]>("/api/ai/insights"),
  });
}

export function useGetAiConversations() {
  return useQuery<AiConversation[]>({
    queryKey: getGetAiConversationsQueryKey(),
    queryFn: () => apiFetch<AiConversation[]>("/api/ai/conversations"),
  });
}

export function usePostAiChat(options?: { mutation?: { onSuccess?: (data: { message: string; reply: string; role: string; conversationId?: string }) => void; onError?: (err: Error) => void } }) {
  const qc = useQueryClient();
  return useMutation<{ message: string; reply: string; role: string; conversationId?: string }, Error, { message: string; conversationId?: string }>({
    mutationFn: (data) => {
      const body: { message: string; conversationId?: string } = { message: data.message };
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