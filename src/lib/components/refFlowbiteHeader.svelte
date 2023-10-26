<script lang="ts">
  import { Button, ButtonGroup, Checkbox, Dropdown, DropdownItem, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte'
  import { Section } from 'flowbite-svelte-blocks'
  import { ChevronDownSolid, ChevronLeftOutline, ChevronRightOutline, FilterSolid, PlusSolid } from 'flowbite-svelte-icons'
  import { onMount } from 'svelte'
  import { recipes } from '../../stores/recipeStore'

  let divClass='bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
  let innerDivClass='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
  let searchClass='w-full md:w-1/2 relative';
  let svgDivClass='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
  let classInput="text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10";

  let searchTerm: string = '';
  let currentPosition: number = 0;
  const itemsPerPage: number = 10;
  const showPage: number = 5;
  let totalPages: number = 0;
  let pagesToShow = [];
  let totalItems: number = $recipes.length
  let startPage: number
  let endPage: number

  const updateDataAndPagination = () => {
    const currentPageItems = $recipes.slice(currentPosition, currentPosition + itemsPerPage);
    renderPagination(currentPageItems.length);
  }

  const loadNextPage = () => {
    if (currentPosition + itemsPerPage < $recipes.length) {
      currentPosition += itemsPerPage;
      updateDataAndPagination();
    }
  }

  const loadPreviousPage = () => {
    if (currentPosition - itemsPerPage >= 0) {
      currentPosition -= itemsPerPage;
      updateDataAndPagination();
    }
  }

  const renderPagination = (totalItems: number) => {
    totalPages = Math.ceil($recipes.length / itemsPerPage);
    const currentPage = Math.ceil((currentPosition + 1) / itemsPerPage);

    startPage = currentPage - Math.floor(showPage / 2);
    startPage = Math.max(1, startPage);
    endPage = Math.min(startPage + showPage - 1, totalPages);

    pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  const goToPage = (pageNumber: number) => {
    currentPosition = (pageNumber - 1) * itemsPerPage;
    updateDataAndPagination();
  }

  $: startRange = currentPosition + 1;
  $: endRange = Math.min(currentPosition + itemsPerPage, totalItems);

  onMount(() => {
    // Call renderPagination when the component initially mounts
    renderPagination($recipes.length);
  });

  $: currentPageItems = $recipes.slice(currentPosition, currentPosition + itemsPerPage);
  $: filteredItems = $recipes.filter((item) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
</script>

<Section name="advancedTable" classSection='bg-gray-50 dark:bg-gray-900 p-3 sm:p-5'>
    <TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm} {divClass} {innerDivClass} {searchClass} {classInput} >

    <div slot="header" class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
      <Button>
        <PlusSolid class="h-3.5 w-3.5 mr-2" />Add product
      </Button>
      <Button color='alternative'>Actions<ChevronDownSolid class="w-3 h-3 ml-2 " /></Button>
        <Dropdown class="w-44 divide-y divide-gray-100">
          <DropdownItem>Mass Edit</DropdownItem>
          <DropdownItem>Delete all</DropdownItem>
        </Dropdown>
      <Button color='alternative'>Filter<FilterSolid class="w-3 h-3 ml-2 " /></Button>
        <Dropdown class="w-48 p-3 space-y-2 text-sm">
          <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Choose mealType</h6>
          <li>
            <Checkbox>Apple (56)</Checkbox>
          </li>
          <li>
            <Checkbox>Microsoft (16)</Checkbox>
          </li>
          <li>
            <Checkbox>Razor (49)</Checkbox>
          </li>
          <li>
            <Checkbox>Nikon (12)</Checkbox>
          </li>
          <li>
            <Checkbox>BenQ (74)</Checkbox>
          </li>
        </Dropdown>
    </div>
      <TableHead>
        <TableHeadCell padding="px-4 py-3" scope="col">Recipe</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Meal type</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Cuisine</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Rating</TableHeadCell>
      </TableHead>
      <TableBody class="divide-y">
        {#if searchTerm !== ''}
          {#each filteredItems as item (item.id)}
            <TableBodyRow>
              <TableBodyCell tdClass="px-4 py-3">{item.name}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3">{item.mealType}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3">{item.cuisine}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3">{item.rating}</TableBodyCell>
            </TableBodyRow>
          {/each}
        {:else}
          {#each currentPageItems as item (item.id)}
            <TableBodyRow>
              <TableBodyCell tdClass="px-4 py-3">{item.name}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3">{item.mealType}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3">{item.cuisine}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3">{item.rating}</TableBodyCell>
            </TableBodyRow>
          {/each}
        {/if}
      </TableBody>
      <div slot="footer" class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
      <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing
        <span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
        of
        <span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
      </span>
        <ButtonGroup>
          <Button on:click={loadPreviousPage} disabled={currentPosition === 0}><ChevronLeftOutline size='xs' class='m-1.5'/></Button>
          {#each pagesToShow as pageNumber}
            <Button on:click={() => goToPage(pageNumber)}>{pageNumber}</Button>
          {/each}
          <Button on:click={loadNextPage} disabled={ totalPages === endPage }><ChevronRightOutline size='xs' class='m-1.5'/></Button>
        </ButtonGroup>
      </div>
    </TableSearch>
</Section>