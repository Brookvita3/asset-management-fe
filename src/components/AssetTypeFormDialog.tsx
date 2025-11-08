import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import { AssetTypeDTO } from '../types/backend';

export interface AssetTypeFormValues {
  name: string;
  description: string;
  isActive: boolean;
}

interface AssetTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetType: AssetTypeDTO | null;
  onSave: (values: AssetTypeFormValues) => Promise<void> | void;
}

const emptyForm: AssetTypeFormValues = {
  name: '',
  description: '',
  isActive: true,
};

export function AssetTypeFormDialog({
  open,
  onOpenChange,
  assetType,
  onSave,
}: AssetTypeFormDialogProps) {
  const [formValues, setFormValues] = useState<AssetTypeFormValues>(emptyForm);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (assetType) {
      setFormValues({
        name: assetType.name,
        description: assetType.description,
        isActive: assetType.isActive,
      });
    } else {
      setFormValues(emptyForm);
    }
    setErrors({});
  }, [assetType, open]);

  const validate = () => {
    const validationErrors: { name?: string; description?: string } = {};

    if (!formValues.name.trim()) {
      validationErrors.name = 'Please enter a name.';
    }

    if (!formValues.description.trim()) {
      validationErrors.description = 'Please provide a short description.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      toast.error('Check the highlighted fields and try again.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        isActive: formValues.isActive,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !isSubmitting && onOpenChange(value)}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {assetType ? 'Edit asset type' : 'Create asset type'}
          </DialogTitle>
          <DialogDescription>
            {assetType
              ? 'Update the details for this asset classification.'
              : 'Provide the details for the new asset classification.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset-type-name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="asset-type-name"
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Laptop, Monitor, Desk..."
                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                autoFocus
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-type-description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="asset-type-description"
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                placeholder="Describe what assets belong to this type..."
                rows={3}
                className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-md border border-dashed border-gray-200 dark:border-gray-700 p-3">
              <div>
                <Label htmlFor="asset-type-active" className="font-medium">
                  Active status
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle to control whether this type can be selected for new assets.
                </p>
              </div>
              <Switch
                id="asset-type-active"
                checked={formValues.isActive}
                onCheckedChange={(checked) =>
                  setFormValues((previous) => ({
                    ...previous,
                    isActive: checked,
                  }))
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600" disabled={isSubmitting}>
              {assetType ? 'Save changes' : 'Create type'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
