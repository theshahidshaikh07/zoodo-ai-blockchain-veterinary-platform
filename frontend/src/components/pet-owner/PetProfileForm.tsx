'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PetProfileFormProps {
  pet?: {
    id: string;
    name: string;
    species: string;
    breed: string;
    gender: string;
    birthday: string;
    age: number;
    ageUnit: string;
    weight: number;
    weightUnit: string;
    microchip: string;
    sterilized: boolean;
    photoUrl: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PetProfileForm({ pet, onSuccess, onCancel }: PetProfileFormProps) {
  const [formData, setFormData] = useState({
    name: pet?.name || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
    gender: pet?.gender || 'unknown',
    birthday: pet?.birthday || '',
    age: pet?.age || '',
    ageUnit: pet?.ageUnit || 'Years',
    weight: pet?.weight || '',
    weightUnit: pet?.weightUnit || 'Kgs',
    microchip: pet?.microchip || '',
    sterilized: pet?.sterilized ? 'yes' : 'no',
    photoUrl: pet?.photoUrl || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // For now, we'll just show a success message
      // TODO: Implement actual pet creation/update API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: pet ? "Pet Updated" : "Pet Added",
        description: `${formData.name} has been ${pet ? 'updated' : 'added'} successfully`,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Pet form error:', error);
      setError('Failed to save pet information');
      toast({
        title: "Error",
        description: "Failed to save pet information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{pet ? 'Edit Pet' : 'Add New Pet'}</CardTitle>
            <CardDescription>
              {pet ? 'Update your pet\'s information' : 'Add a new pet to your profile'}
            </CardDescription>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="Enter pet's name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Species *</Label>
              <Select
                value={formData.species}
                onValueChange={(value) => handleSelectChange('species', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dog">Dog</SelectItem>
                  <SelectItem value="Cat">Cat</SelectItem>
                  <SelectItem value="Bird">Bird</SelectItem>
                  <SelectItem value="Rabbit">Rabbit</SelectItem>
                  <SelectItem value="Hamster">Hamster</SelectItem>
                  <SelectItem value="Fish">Fish</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Enter breed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <div className="flex space-x-2">
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Age"
                  className="flex-1"
                />
                <Select
                  value={formData.ageUnit}
                  onValueChange={(value) => handleSelectChange('ageUnit', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Years">Years</SelectItem>
                    <SelectItem value="Months">Months</SelectItem>
                    <SelectItem value="Days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <div className="flex space-x-2">
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Weight"
                  className="flex-1"
                />
                <Select
                  value={formData.weightUnit}
                  onValueChange={(value) => handleSelectChange('weightUnit', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kgs">Kgs</SelectItem>
                    <SelectItem value="Gms">Gms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sterilized">Sterilized</Label>
              <Select
                value={formData.sterilized}
                onValueChange={(value) => handleSelectChange('sterilized', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchip">Microchip ID</Label>
            <Input
              id="microchip"
              name="microchip"
              value={formData.microchip}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Enter microchip ID if available"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input
              id="photoUrl"
              name="photoUrl"
              type="url"
              value={formData.photoUrl}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Enter photo URL (optional)"
            />
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {pet ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {pet ? 'Update Pet' : 'Add Pet'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
