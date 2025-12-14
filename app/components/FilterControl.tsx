"use client"
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { yearOptions, storeyRangesOptions, flatTypesOptions, leaseCommenceOptions } from "../data/hdbOptions"
import { useTownStore } from "../store/TownStore"
import { AvgMedianToggle } from "./AvgMedianToggle"

const FilterControl: React.FC = () => {
  const [year, setYear] = useState<string>("2025")
  const [floor, setFloor] = useState<string>("ALL")
  const [flatType, setFlatType] = useState<string>("ALL")
  const [commencement, setCommmence] = useState<string>("ALL")

  const { calculateAvgPsf } = useTownStore();

  // This fires whenever selection changes
  const handleYearChange = (value: string) => {
    setYear(value)
  }

  const handleFloorChange = (value: string) => {
    setFloor(value)
  }


  const handleFlatChange = (value: string) => {
    setFlatType(value)
  }
  const handleCommencementChange = (value: string) => {
    setCommmence(value)
  }

  useEffect(() => {
    calculateAvgPsf({
      year: year,
      flatType: flatType === "ALL" ? "" : flatType,
      storyRange: floor === "ALL" ? "" : floor,
      commencement : commencement === "ALL" ? "" : commencement
    })
  }, [year, floor, flatType, commencement])

  // calculateAvgPsf({
  //   year: year,
  //   flatType: flatType,
  //   storyRange: floor
  // })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-center">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Year</label>
          <Select value={year} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Floor</label>
          <Select value={floor} onValueChange={handleFloorChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Floor" />
            </SelectTrigger>
            <SelectContent>
              {storeyRangesOptions.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Flat Type</label>
          <Select value={flatType} onValueChange={handleFlatChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Flat Type" />
            </SelectTrigger>
            <SelectContent>
              {flatTypesOptions.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Commencement</label>
          <Select value={commencement} onValueChange={handleCommencementChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Commencement" />
            </SelectTrigger>
            <SelectContent>
              {leaseCommenceOptions.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
      <div className="flex gap-4 justify-center">
        <AvgMedianToggle />
      </div>
    </div>
  )
}
export default FilterControl;
