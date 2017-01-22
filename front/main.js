import $ from 'jquery';
import rafThrottle from 'raf-throttle';
import { onScroll } from './blocks/gem-header';
import { init as helpTooltipInit } from './blocks/help-tooltip';
import { draw as drawTableMainChart } from './blocks/gem-stats-chart';
import { renderTableCharts } from './blocks/gem-table-chart';
import { smoothAnchorScrolling } from './blocks/link';
import { isMobileView, arrayFromNodes, DOM } from './blocks/utils';
import searchForm from './blocks/search';
import { gemDescriptionCollapser } from './blocks/gem';
import initToggleable from './blocks/toggleable';


if (process.env.NODE_ENV === 'development') {
  window.$ = $;
}

$(() => {
  if ($('#sticky-project-header').length) {
    $(window).on('scroll', rafThrottle(onScroll));
    onScroll();
  }

  smoothAnchorScrolling();

  if (!isMobileView() && $('.help-tooltip').length) {
    helpTooltipInit();
  }

  searchForm('.search');
  gemDescriptionCollapser();
  $('.gem-stats-chart').each(function onEachChart() {
    drawTableMainChart(this, $(this).data('chart'));
  });

  initToggleable((toggleable) => {
    const stickyHeaderTitle = document.querySelector('#sticky-header-title');
    const table = toggleable.querySelector('.js-gems-stats-table');
    const tablePeriodTitle = table.querySelector('.js-gems-stats-table__period-title');
    const tableStatsType = DOM.closest(table, '.gem-stats');

    renderTableCharts({
      chartsNodes: table.querySelectorAll('.js-gems-stats-table__row-chart'),
      statsCellNodes: table.querySelectorAll('.js-gems-stats-table__cell-stats'),
      maxQuarters: JSON.parse(table.dataset.maxQuarters),
      onShow: (value) => {
        stickyHeaderTitle.textContent = `${tableStatsType.dataset.title}${value ? ` - ${value}` : ''}`;
        tablePeriodTitle.textContent = value;
      },
      onOut: () => {
        stickyHeaderTitle.textContent = '';
        tablePeriodTitle.textContent = 'This year';
      }
    });
  });
});
