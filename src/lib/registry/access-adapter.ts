'use client';
import { NOVA_SYSTEM_REGISTRY, type SystemRoleConfig } from './system-registry';

export interface AuthenticatedUser {
  id: string; email: string; username: string; fullName?: string | null;
  role: string; jobTitle?: string | null; companyId?: string | null; isActive: boolean;
}

const PROFESSION_RANK_MAP: Record<string, string> = {
  'مدير عام': 'owner_executive', 'مدير مشاريع': 'owner_executive',
  'مدير موارد بشرية': 'owner_executive', 'مدير مالي': 'financial_manager',
  'محاسب رواتب': 'financial_manager', 'محاسب': 'financial_manager',
  'مدير حسابات': 'financial_manager', 'مسؤول مالي': 'financial_manager',
  'مهندس موقع': 'engineer', 'مهندس مدني': 'engineer', 'مهندس كهرباء': 'engineer',
  'مهندس معماري': 'engineer', 'مساح ميداني': 'engineer', 'رسام معماري': 'engineer',
  'سكرتارية': 'engineer', 'مسؤول موارد بشرية': 'engineer',
};

export class NovaAccessAdapter {
  static resolveSystemRole(jobTitle: string | undefined | null, baseRole: string): string {
    if (baseRole === 'admin') return 'owner_executive';
    const mappedRank = jobTitle ? PROFESSION_RANK_MAP[jobTitle] : null;
    if (mappedRank) return mappedRank;
    if (baseRole === 'accountant') return 'financial_manager';
    if (baseRole === 'engineer') return 'engineer';
    if (baseRole === 'hr') return 'owner_executive';
    return 'engineer';
  }
  static injectSecurityContext(user: AuthenticatedUser): AuthenticatedUser & { systemConfig: SystemRoleConfig } {
    const systemRoleKey = this.resolveSystemRole(user.jobTitle || undefined, user.role);
    const config = NOVA_SYSTEM_REGISTRY[systemRoleKey] || NOVA_SYSTEM_REGISTRY.engineer;
    return { ...user, systemConfig: config };
  }
  static getAllowedModules(user: AuthenticatedUser): string[] {
    return this.injectSecurityContext(user).systemConfig.allowedModules;
  }
  static canAccessModule(user: AuthenticatedUser, moduleKey: string): boolean {
    return this.getAllowedModules(user).includes(moduleKey);
  }
}
